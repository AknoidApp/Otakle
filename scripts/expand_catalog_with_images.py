from __future__ import annotations

import csv
import io
import math
import re
import time
from collections import defaultdict
from pathlib import Path
from typing import Any

import requests
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageOps

PROJECT_ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = PROJECT_ROOT / 'data' / 'otakle_characters.csv'
IMAGES_DIR = PROJECT_ROOT / 'public' / 'images'
SIZE = 1024
TIMEOUT = 45

ANIME_IDS = {
    'Dragon Ball': 223,
    'Naruto': 20,
    'One Piece': 21,
    'Bleach': 269,
    'My Hero Academia': 31964,
    'Pokemon': 527,
    'Kimetsu no Yaiba': 38000,
    'Saint Seiya': 1254,
    'Jujutsu Kaisen': 40748,
    'Attack on Titan': 16498,
    "JoJo's Bizarre Adventure": 14719,
    'Death Note': 1535,
    'Hunter x Hunter': 11061,
    'Inuyasha': 249,
    'One Punch Man': 30276,
    'Haikyuu!!': 20583,
    'Fullmetal Alchemist': 121,
    'Chainsaw Man': 44511,
    'Spy x Family': 50265,
    'Fairy Tail': 6702,
    'Black Clover': 34572,
    'Sailor Moon': 530,
    'Neon Genesis Evangelion': 30,
    'Code Geass': 1575,
    'Cowboy Bebop': 1,
    'Rurouni Kenshin': 45,
    'Cardcaptor Sakura': 232,
    'Steins;Gate': 9253,
    'Tokyo Ghoul': 22319,
    'Yu Yu Hakusho': 392,
    'Kaguya-sama: Love is War': 37999,
    'Toradora!': 4224,
}

ADDITIONS = [
    ('goten', 'Goten', 'Dragon Ball', 'Secundario', 'Masculino', 'Saiyajin', 'Niño', 'Adolescente', 'Son, Goten'),
    ('broly', 'Broly', 'Dragon Ball', 'Antagonista', 'Masculino', 'Saiyajin', 'Adulto', 'Adulto', 'Broly'),
    ('yamcha', 'Yamcha', 'Dragon Ball', 'Secundario', 'Masculino', 'Humano', 'Joven', 'Adulto', 'Yamcha'),
    ('ten_shin_han', 'Ten Shin Han', 'Dragon Ball', 'Secundario', 'Masculino', 'Humano', 'Adulto', 'Adulto', 'Tien Shinhan'),
    ('android_18', 'Android 18', 'Dragon Ball', 'Secundario', 'Femenino', 'Androide', 'Adulto', 'Adulto', 'Juuhachi-gou'),
    ('android_17', 'Android 17', 'Dragon Ball', 'Secundario', 'Masculino', 'Androide', 'Adulto', 'Adulto', 'Juunanagou'),
    ('master_roshi', 'Master Roshi', 'Dragon Ball', 'Secundario', 'Masculino', 'Humano', 'Adulto', 'Adulto', 'Muten-Roushi'),
    ('hinata_hyuga', 'Hinata Hyuga', 'Naruto', 'Secundario', 'Femenino', 'Humano', 'Adolescente', 'Joven', 'Hyuuga, Hinata'),
    ('rock_lee', 'Rock Lee', 'Naruto', 'Secundario', 'Masculino', 'Humano', 'Adolescente', 'Joven', 'Rock Lee'),
    ('neji_hyuga', 'Neji Hyuga', 'Naruto', 'Secundario', 'Masculino', 'Humano', 'Adolescente', 'Joven', 'Hyuuga, Neji'),
    ('kiba_inuzuka', 'Kiba Inuzuka', 'Naruto', 'Secundario', 'Masculino', 'Humano', 'Adolescente', 'Joven', 'Inuzuka, Kiba'),
    ('minato_namikaze', 'Minato Namikaze', 'Naruto', 'Secundario', 'Masculino', 'Humano', 'Adulto', 'Adulto', 'Namikaze, Minato'),
    ('killer_bee', 'Killer Bee', 'Naruto', 'Secundario', 'Masculino', 'Humano', 'Adulto', 'Adulto', 'Killer Bee'),
    ('konan', 'Konan', 'Naruto', 'Secundario', 'Femenino', 'Humano', 'Adulto', 'Adulto', 'Konan'),
    ('buggy', 'Buggy', 'One Piece', 'Secundario', 'Masculino', 'Humano', 'Adulto', 'Adulto', 'Buggy'),
    ('crocodile', 'Crocodile', 'One Piece', 'Antagonista', 'Masculino', 'Humano', 'Adulto', 'Adulto', 'Crocodile'),
    ('enel', 'Enel', 'One Piece', 'Antagonista', 'Masculino', 'Humano', 'Adulto', 'Adulto', 'Enel'),
    ('eustass_kid', 'Eustass Kid', 'One Piece', 'Secundario', 'Masculino', 'Humano', 'Joven', 'Adulto', 'Kid, Eustass'),
    ('killer', 'Killer', 'One Piece', 'Secundario', 'Masculino', 'Humano', 'Joven', 'Adulto', 'Killer'),
    ('kozuki_oden', 'Kozuki Oden', 'One Piece', 'Secundario', 'Masculino', 'Humano', 'Adulto', 'Adulto', 'Kouzuki, Oden'),
    ('dracule_mihawk', 'Dracule Mihawk', 'One Piece', 'Secundario', 'Masculino', 'Humano', 'Adulto', 'Adulto', 'Mihawk, Dracule'),
    ('rob_lucci', 'Rob Lucci', 'One Piece', 'Antagonista', 'Masculino', 'Humano', 'Adulto', 'Adulto', 'Lucci, Rob'),
    ('yamato', 'Yamato', 'One Piece', 'Secundario', 'Femenino', 'Otro', 'Joven', 'Adulto', 'Yamato'),
    ('bartolomeo', 'Bartolomeo', 'One Piece', 'Secundario', 'Masculino', 'Humano', 'Adulto', 'Adulto', 'Bartolomeo'),
    ('kisuke_urahara', 'Kisuke Urahara', 'Bleach', 'Secundario', 'Masculino', 'Shinigami', 'Adulto', 'Adulto', 'Urahara, Kisuke'),
    ('grimmjow', 'Grimmjow', 'Bleach', 'Antagonista', 'Masculino', 'Otro', 'Adulto', 'Adulto', 'Jaegerjaquez, Grimmjow'),
    ('ulquiorra', 'Ulquiorra', 'Bleach', 'Antagonista', 'Masculino', 'Otro', 'Adulto', 'Adulto', 'Cifer, Ulquiorra'),
    ('gin_ichimaru', 'Gin Ichimaru', 'Bleach', 'Antagonista', 'Masculino', 'Shinigami', 'Adulto', 'Adulto', 'Ichimaru, Gin'),
    ('mayuri_kurotsuchi', 'Mayuri Kurotsuchi', 'Bleach', 'Secundario', 'Masculino', 'Shinigami', 'Adulto', 'Adulto', 'Kurotsuchi, Mayuri'),
    ('yamamoto', 'Yamamoto', 'Bleach', 'Secundario', 'Masculino', 'Shinigami', 'Adulto', 'Adulto', 'Yamamoto-Genryuusai, Shigekuni'),
    ('eijiro_kirishima', 'Eijiro Kirishima', 'My Hero Academia', 'Secundario', 'Masculino', 'Humano', 'Adolescente', 'Adolescente', 'Kirishima, Eijirou'),
    ('tenya_iida', 'Tenya Iida', 'My Hero Academia', 'Secundario', 'Masculino', 'Humano', 'Adolescente', 'Adolescente', 'Iida, Tenya'),
    ('endeavor', 'Endeavor', 'My Hero Academia', 'Secundario', 'Masculino', 'Humano', 'Adulto', 'Adulto', 'Todoroki, Enji'),
    ('himiko_toga', 'Himiko Toga', 'My Hero Academia', 'Antagonista', 'Femenino', 'Humano', 'Adolescente', 'Adolescente', 'Toga, Himiko'),
    ('denki_kaminari', 'Denki Kaminari', 'My Hero Academia', 'Secundario', 'Masculino', 'Humano', 'Adolescente', 'Adolescente', 'Kaminari, Denki'),
    ('mina_ashido', 'Mina Ashido', 'My Hero Academia', 'Secundario', 'Femenino', 'Humano', 'Adolescente', 'Adolescente', 'Ashido, Mina'),
    ('dawn', 'Dawn', 'Pokemon', 'Secundario', 'Femenino', 'Humano', 'Adolescente', 'Adolescente', 'Hikari'),
    ('serena', 'Serena', 'Pokemon', 'Secundario', 'Femenino', 'Humano', 'Adolescente', 'Adolescente', 'Serena'),
    ('cynthia', 'Cynthia', 'Pokemon', 'Secundario', 'Femenino', 'Humano', 'Adulto', 'Adulto', 'Shirona'),
    ('gary_oak', 'Gary Oak', 'Pokemon', 'Secundario', 'Masculino', 'Humano', 'Adolescente', 'Adolescente', 'Shigeru'),
    ('lucario', 'Lucario', 'Pokemon', 'Secundario', 'Otro', 'Otro', 'Adulto', 'Adulto', 'Lucario'),
    ('charizard', 'Charizard', 'Pokemon', 'Secundario', 'Otro', 'Otro', 'Adulto', 'Adulto', 'Lizardon'),
    ('eevee', 'Eevee', 'Pokemon', 'Secundario', 'Otro', 'Otro', 'Niño', 'Niño', 'Eievui'),
    ('kanao_tsuyuri', 'Kanao Tsuyuri', 'Kimetsu no Yaiba', 'Secundario', 'Femenino', 'Humano', 'Adolescente', 'Adolescente', 'Tsuyuri, Kanao'),
    ('kyojuro_rengoku', 'Kyojuro Rengoku', 'Kimetsu no Yaiba', 'Secundario', 'Masculino', 'Humano', 'Adulto', 'Adulto', 'Rengoku, Kyoujurou'),
    ('tengen_uzui', 'Tengen Uzui', 'Kimetsu no Yaiba', 'Secundario', 'Masculino', 'Humano', 'Adulto', 'Adulto', 'Uzui, Tengen'),
    ('mitsuri_kanroji', 'Mitsuri Kanroji', 'Kimetsu no Yaiba', 'Secundario', 'Femenino', 'Humano', 'Adulto', 'Adulto', 'Kanroji, Mitsuri'),
    ('gyomei_himejima', 'Gyomei Himejima', 'Kimetsu no Yaiba', 'Secundario', 'Masculino', 'Humano', 'Adulto', 'Adulto', 'Himejima, Gyoumei'),
    ('mu_aries', 'Mu de Aries', 'Saint Seiya', 'Secundario', 'Masculino', 'Humano', 'Adulto', 'Adulto', 'Aries no Muu'),
    ('aldebaran', 'Aldebarán', 'Saint Seiya', 'Secundario', 'Masculino', 'Humano', 'Adulto', 'Adulto', 'Taurus no Aldebaran'),
    ('saga', 'Saga', 'Saint Seiya', 'Antagonista', 'Masculino', 'Humano', 'Adulto', 'Adulto', 'Gemini no Saga'),
    ('deathmask', 'Deathmask', 'Saint Seiya', 'Antagonista', 'Masculino', 'Humano', 'Adulto', 'Adulto', 'Cancer no Deathmask'),
    ('camus', 'Camus', 'Saint Seiya', 'Secundario', 'Masculino', 'Humano', 'Adulto', 'Adulto', 'Aquarius no Camus'),
    ('maki_zenin', 'Maki Zenin', 'Jujutsu Kaisen', 'Secundario', 'Femenino', 'Humano', 'Adolescente', 'Adolescente', 'Zenin, Maki'),
    ('toge_inumaki', 'Toge Inumaki', 'Jujutsu Kaisen', 'Secundario', 'Masculino', 'Humano', 'Adolescente', 'Adolescente', 'Inumaki, Toge'),
    ('yuta_okkotsu', 'Yuta Okkotsu', 'Jujutsu Kaisen', 'Secundario', 'Masculino', 'Humano', 'Adolescente', 'Adolescente', 'Okkotsu, Yuuta'),
    ('kento_nanami', 'Kento Nanami', 'Jujutsu Kaisen', 'Secundario', 'Masculino', 'Humano', 'Adulto', 'Adulto', 'Nanami, Kento'),
    ('levi_ackerman', 'Levi Ackerman', 'Attack on Titan', 'Secundario', 'Masculino', 'Humano', 'Adulto', 'Adulto', 'Ackerman, Levi'),
    ('armin_arlert', 'Armin Arlert', 'Attack on Titan', 'Secundario', 'Masculino', 'Humano', 'Adolescente', 'Joven', 'Arlelt, Armin'),
    ('annie_leonhart', 'Annie Leonhart', 'Attack on Titan', 'Antagonista', 'Femenino', 'Humano', 'Adolescente', 'Joven', 'Leonhart, Annie'),
    ('jean_kirstein', 'Jean Kirstein', 'Attack on Titan', 'Secundario', 'Masculino', 'Humano', 'Adolescente', 'Joven', 'Kirstein, Jean'),
    ('bruno_bucciarati', 'Bruno Bucciarati', "JoJo's Bizarre Adventure", 'Secundario', 'Masculino', 'Humano', 'Joven', 'Adulto', 'Bucciarati, Bruno'),
    ('jolyne_cujoh', 'Jolyne Cujoh', "JoJo's Bizarre Adventure", 'Protagonista', 'Femenino', 'Humano', 'Joven', 'Joven', 'Cujoh, Jolyne'),
    ('noriaki_kakyoin', 'Noriaki Kakyoin', "JoJo's Bizarre Adventure", 'Secundario', 'Masculino', 'Humano', 'Adolescente', 'Adolescente', 'Kakyoin, Noriaki'),
    ('yoshikage_kira', 'Yoshikage Kira', "JoJo's Bizarre Adventure", 'Antagonista', 'Masculino', 'Humano', 'Adulto', 'Adulto', 'Kira, Yoshikage'),
    ('teru_mikami', 'Teru Mikami', 'Death Note', 'Secundario', 'Masculino', 'Humano', 'Adulto', 'Adulto', 'Mikami, Teru'),
    ('touta_matsuda', 'Touta Matsuda', 'Death Note', 'Secundario', 'Masculino', 'Humano', 'Adulto', 'Adulto', 'Matsuda, Touta'),
    ('killua_zoldyck', 'Killua Zoldyck', 'Hunter x Hunter', 'Deuteragonista', 'Masculino', 'Humano', 'Niño', 'Adolescente', 'Zoldyck, Killua'),
    ('leorio', 'Leorio', 'Hunter x Hunter', 'Secundario', 'Masculino', 'Humano', 'Joven', 'Adulto', 'Paladiknight, Leorio'),
    ('chrollo_lucilfer', 'Chrollo Lucilfer', 'Hunter x Hunter', 'Antagonista', 'Masculino', 'Humano', 'Adulto', 'Adulto', 'Lucilfer, Chrollo'),
    ('biscuit_krueger', 'Biscuit Krueger', 'Hunter x Hunter', 'Secundario', 'Femenino', 'Humano', 'Adulto', 'Adulto', 'Krueger, Biscuit'),
    ('miroku', 'Miroku', 'Inuyasha', 'Secundario', 'Masculino', 'Humano', 'Joven', 'Joven', 'Miroku'),
    ('sango', 'Sango', 'Inuyasha', 'Secundario', 'Femenino', 'Humano', 'Joven', 'Joven', 'Sango'),
    ('fubuki', 'Fubuki', 'One Punch Man', 'Secundario', 'Femenino', 'Humano', 'Joven', 'Joven', 'Fubuki'),
    ('speed_o_sound_sonic', "Speed-o'-Sound Sonic", 'One Punch Man', 'Antagonista', 'Masculino', 'Humano', 'Adulto', 'Adulto', 'Sonic'),
    ('kuroo_tetsuro', 'Kuroo Tetsuro', 'Haikyuu!!', 'Secundario', 'Masculino', 'Humano', 'Adolescente', 'Adolescente', 'Kuroo, Tetsurou'),
    ('kotaro_bokuto', 'Kotaro Bokuto', 'Haikyuu!!', 'Secundario', 'Masculino', 'Humano', 'Adolescente', 'Adolescente', 'Bokuto, Koutarou'),
    ('alphonse_elric', 'Alphonse Elric', 'Fullmetal Alchemist', 'Deuteragonista', 'Masculino', 'Humano', 'Niño', 'Adolescente', 'Elric, Alphonse'),
    ('winry_rockbell', 'Winry Rockbell', 'Fullmetal Alchemist', 'Secundario', 'Femenino', 'Humano', 'Adolescente', 'Adolescente', 'Rockbell, Winry'),
    ('kobeni', 'Kobeni', 'Chainsaw Man', 'Secundario', 'Femenino', 'Humano', 'Joven', 'Joven', 'Higashiyama, Kobeni'),
    ('reze', 'Reze', 'Chainsaw Man', 'Antagonista', 'Femenino', 'Humano', 'Joven', 'Joven', 'Reze'),
    ('loid_forger', 'Loid Forger', 'Spy x Family', 'Protagonista', 'Masculino', 'Humano', 'Adulto', 'Adulto', 'Forger, Loid'),
    ('natsu_dragneel', 'Natsu Dragneel', 'Fairy Tail', 'Protagonista', 'Masculino', 'Humano', 'Adolescente', 'Joven', 'Dragneel, Natsu'),
    ('noelle_silva', 'Noelle Silva', 'Black Clover', 'Secundario', 'Femenino', 'Humano', 'Adolescente', 'Adolescente', 'Silva, Noelle'),
    ('ami_mizuno', 'Ami Mizuno', 'Sailor Moon', 'Secundario', 'Femenino', 'Humano', 'Adolescente', 'Adolescente', 'Mizuno, Ami'),
    ('rei_hino', 'Rei Hino', 'Sailor Moon', 'Secundario', 'Femenino', 'Humano', 'Adolescente', 'Adolescente', 'Hino, Rei'),
    ('makoto_kino', 'Makoto Kino', 'Sailor Moon', 'Secundario', 'Femenino', 'Humano', 'Adolescente', 'Adolescente', 'Kino, Makoto'),
    ('minako_aino', 'Minako Aino', 'Sailor Moon', 'Secundario', 'Femenino', 'Humano', 'Adolescente', 'Adolescente', 'Aino, Minako'),
    ('rei_ayanami', 'Rei Ayanami', 'Neon Genesis Evangelion', 'Secundario', 'Femenino', 'Humano', 'Adolescente', 'Adolescente', 'Ayanami, Rei'),
    ('asuka_langley', 'Asuka Langley', 'Neon Genesis Evangelion', 'Deuteragonista', 'Femenino', 'Humano', 'Adolescente', 'Adolescente', 'Souryuu, Asuka Langley'),
    ('kaworu_nagisa', 'Kaworu Nagisa', 'Neon Genesis Evangelion', 'Secundario', 'Masculino', 'Humano', 'Adolescente', 'Adolescente', 'Nagisa, Kaworu'),
    ('kallen_stadtfeld', 'Kallen Stadtfeld', 'Code Geass', 'Secundario', 'Femenino', 'Humano', 'Adolescente', 'Adolescente', 'Stadtfeld, Kallen'),
    ('faye_valentine', 'Faye Valentine', 'Cowboy Bebop', 'Secundario', 'Femenino', 'Humano', 'Adulto', 'Adulto', 'Valentine, Faye'),
    ('hajime_saito', 'Hajime Saito', 'Rurouni Kenshin', 'Secundario', 'Masculino', 'Humano', 'Adulto', 'Adulto', 'Saitou, Hajime'),
    ('syaoran_li', 'Syaoran Li', 'Cardcaptor Sakura', 'Secundario', 'Masculino', 'Humano', 'Niño', 'Adolescente', 'Li, Syaoran'),
    ('itaru_hashida', 'Itaru Hashida', 'Steins;Gate', 'Secundario', 'Masculino', 'Humano', 'Joven', 'Joven', 'Hashida, Itaru'),
    ('juuzou_suzuya', 'Juuzou Suzuya', 'Tokyo Ghoul', 'Secundario', 'Masculino', 'Humano', 'Adolescente', 'Adolescente', 'Suzuya, Juuzou'),
    ('yusuke_urameshi', 'Yusuke Urameshi', 'Yu Yu Hakusho', 'Protagonista', 'Masculino', 'Humano', 'Adolescente', 'Adolescente', 'Urameshi, Yusuke'),
    ('ai_hayasaka', 'Ai Hayasaka', 'Kaguya-sama: Love is War', 'Secundario', 'Femenino', 'Humano', 'Adolescente', 'Adolescente', 'Hayasaka, Ai'),
    ('ryuuji_takasu', 'Ryuuji Takasu', 'Toradora!', 'Protagonista', 'Masculino', 'Humano', 'Adolescente', 'Adolescente', 'Takasu, Ryuuji'),
]

SESSION = requests.Session()
ANIME_CACHE: dict[str, list[dict[str, Any]]] = {}
SEARCH_CACHE: dict[str, list[dict[str, Any]]] = {}


def slug(text: str) -> str:
    text = text.lower().replace('’', "'")
    return re.sub(r'[^a-z0-9]+', '', text)


def token_set(text: str) -> set[str]:
    cleaned = re.sub(r'[^a-z0-9]+', ' ', text.lower().replace('’', "'"))
    return {part for part in cleaned.split() if part}


def read_csv_rows() -> list[dict[str, str]]:
    with CSV_PATH.open('r', encoding='utf-8', newline='') as f:
        return list(csv.DictReader(f))


def write_csv_rows(rows: list[dict[str, str]]) -> None:
    fieldnames = [
        'id', 'name', 'anime', 'genre', 'debutYear', 'ageDebut', 'ageMain', 'studio',
        'role', 'gender', 'race', 'debutInfo', 'imageFileName', 'active'
    ]
    with CSV_PATH.open('w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def anime_defaults(rows: list[dict[str, str]]) -> dict[str, dict[str, str]]:
    defaults: dict[str, dict[str, str]] = {}
    for row in rows:
        anime = row['anime']
        if anime not in defaults:
            defaults[anime] = {
                'genre': row['genre'],
                'debutYear': row['debutYear'],
                'studio': row['studio'],
            }
    return defaults


def fetch_anime_characters(anime: str) -> list[dict[str, Any]]:
    if anime in ANIME_CACHE:
        return ANIME_CACHE[anime]
    mal_id = ANIME_IDS.get(anime)
    if mal_id is None:
        ANIME_CACHE[anime] = []
        return []
    url = f'https://api.jikan.moe/v4/anime/{mal_id}/characters'
    resp = SESSION.get(url, timeout=TIMEOUT)
    resp.raise_for_status()
    data = resp.json().get('data', [])
    ANIME_CACHE[anime] = data
    time.sleep(0.35)
    return data


def fetch_search_results(query: str) -> list[dict[str, Any]]:
    if query in SEARCH_CACHE:
        return SEARCH_CACHE[query]
    resp = SESSION.get('https://api.jikan.moe/v4/characters', params={'q': query, 'limit': 10}, timeout=TIMEOUT)
    resp.raise_for_status()
    data = resp.json().get('data', [])
    SEARCH_CACHE[query] = data
    time.sleep(0.35)
    return data


def score_candidate(candidate_name: str, source_name: str, display_name: str) -> tuple[int, int, int]:
    cand_slug = slug(candidate_name)
    source_slug = slug(source_name)
    display_slug = slug(display_name)
    cand_tokens = token_set(candidate_name)
    source_tokens = token_set(source_name)
    display_tokens = token_set(display_name)
    exact = int(cand_slug == source_slug or cand_slug == display_slug)
    overlap = len(cand_tokens & (source_tokens | display_tokens))
    containment = int(source_slug in cand_slug or display_slug in cand_slug or cand_slug in source_slug or cand_slug in display_slug)
    return (exact, overlap, containment)


def anime_title_matches(target_anime: str, anime_title: str) -> bool:
    target = token_set(target_anime)
    title = token_set(anime_title)
    if not target or not title:
        return False
    common = target & title
    return len(common) >= max(1, min(2, len(target)))


def find_image_url(anime: str, display_name: str, source_name: str) -> str:
    candidates = []
    for item in fetch_anime_characters(anime):
        char = item.get('character', {})
        name = char.get('name') or ''
        score = score_candidate(name, source_name, display_name)
        candidates.append((score, name, char.get('images', {}).get('jpg', {}).get('image_url') or char.get('images', {}).get('webp', {}).get('image_url')))
    candidates.sort(reverse=True)
    if candidates and candidates[0][0] >= (0, 1, 0) and candidates[0][2]:
        return candidates[0][2]

    for query in [source_name, display_name, f'{display_name} {anime}']:
        best: tuple[tuple[int, int, int, int], str] | None = None
        for item in fetch_search_results(query):
            char = item.get('character') or item
            name = char.get('name') or item.get('name') or ''
            anime_refs = item.get('anime', [])
            anime_bonus = 0
            for ref in anime_refs:
                title = (ref.get('anime') or {}).get('title', '')
                if anime_title_matches(anime, title):
                    anime_bonus = 1
                    break
            score = score_candidate(name, source_name, display_name) + (anime_bonus,)
            image_url = (char.get('images', {}).get('jpg', {}).get('image_url')
                         or char.get('images', {}).get('webp', {}).get('image_url')
                         or item.get('images', {}).get('jpg', {}).get('image_url')
                         or item.get('images', {}).get('webp', {}).get('image_url'))
            if image_url and (best is None or score > best[0]):
                best = (score, image_url)
        if best and best[0] >= (0, 1, 0, 0):
            return best[1]
    raise RuntimeError(f'No pude encontrar imagen para {display_name} / {source_name} en {anime}')


def remove_background(image: Image.Image) -> Image.Image:
    image = image.convert('RGBA')
    w, h = image.size
    samples = [image.getpixel((0, 0)), image.getpixel((w - 1, 0)), image.getpixel((0, h - 1)), image.getpixel((w - 1, h - 1))]
    avg = tuple(sum(px[i] for px in samples) // len(samples) for i in range(3))
    px = []
    for r, g, b, a in image.getdata():
        diff = abs(r - avg[0]) + abs(g - avg[1]) + abs(b - avg[2])
        brightness = (r + g + b) / 3
        if diff < 55 or brightness > 250:
            px.append((r, g, b, 0))
        else:
            px.append((r, g, b, a))
    image.putdata(px)
    bbox = image.getbbox()
    if bbox:
        image = image.crop(bbox)
    return image


def make_background() -> Image.Image:
    bg = Image.new('RGBA', (SIZE, SIZE), (118, 118, 118, 255))
    overlay = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    draw.ellipse((150, 120, 874, 900), fill=(0, 0, 0, 120))
    overlay = overlay.filter(ImageFilter.GaussianBlur(60))
    return Image.alpha_composite(bg, overlay)


def stylize(raw: Image.Image) -> Image.Image:
    raw = remove_background(raw)
    raw = ImageOps.exif_transpose(raw)
    rgb = raw.convert('RGB')
    rgb = ImageEnhance.Color(rgb).enhance(1.05)
    rgb = ImageEnhance.Contrast(rgb).enhance(1.08)
    rgb = ImageOps.posterize(rgb, 5)
    subject = rgb.convert('RGBA')
    alpha = raw.getchannel('A')
    subject.putalpha(alpha)
    bbox = subject.getbbox()
    if bbox:
        subject = subject.crop(bbox)
    subject.thumbnail((760, 760), Image.Resampling.LANCZOS)

    canvas = make_background()
    x = (SIZE - subject.width) // 2
    y = SIZE - subject.height - 150

    shadow_mask = subject.getchannel('A').filter(ImageFilter.GaussianBlur(22))
    shadow = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    shadow.paste((0, 0, 0, 205), (x, y + 15), shadow_mask)
    shadow = shadow.filter(ImageFilter.GaussianBlur(18))
    canvas = Image.alpha_composite(canvas, shadow)
    canvas.paste(subject, (x, y), subject)

    face_overlay = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    face_draw = ImageDraw.Draw(face_overlay)
    fx = x + subject.width * 0.5
    fy = y + subject.height * 0.42
    rx = max(110, int(subject.width * 0.18))
    ry = max(85, int(subject.height * 0.12))
    face_draw.ellipse((fx - rx, fy - ry, fx + rx, fy + ry), fill=(74, 70, 73, 205))
    face_overlay = face_overlay.filter(ImageFilter.GaussianBlur(22))
    canvas = Image.alpha_composite(canvas, face_overlay)

    glow = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse((x + 40, y + subject.height - 35, x + subject.width - 40, y + subject.height + 60), fill=(255, 160, 120, 90))
    glow = glow.filter(ImageFilter.GaussianBlur(32))
    canvas = Image.alpha_composite(canvas, glow)

    vignette = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    vignette_draw = ImageDraw.Draw(vignette)
    vignette_draw.rectangle((0, 0, SIZE, SIZE), fill=(0, 0, 0, 35))
    vignette = vignette.filter(ImageFilter.GaussianBlur(40))
    canvas = Image.alpha_composite(canvas, vignette)
    return canvas.convert('RGBA')


def download_image(url: str) -> Image.Image:
    resp = SESSION.get(url, timeout=TIMEOUT)
    resp.raise_for_status()
    return Image.open(io.BytesIO(resp.content))


def ensure_image(entry: dict[str, str]) -> None:
    out_path = IMAGES_DIR / entry['imageFileName']
    if out_path.exists():
        return
    url = find_image_url(entry['anime'], entry['name'], entry['sourceName'])
    raw = download_image(url)
    stylized = stylize(raw)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    stylized.save(out_path, format='PNG', optimize=True)
    print(f'🖼️  {entry["name"]} -> {out_path.name}')
    time.sleep(0.15)


def build_entries(rows: list[dict[str, str]]) -> list[dict[str, str]]:
    defaults = anime_defaults(rows)
    existing_ids = {row['id'] for row in rows}
    built: list[dict[str, str]] = []
    for item in ADDITIONS:
        char_id, name, anime, role, gender, race, age_debut, age_main, source = item
        if char_id in existing_ids:
            continue
        meta = defaults[anime]
        built.append({
            'id': char_id,
            'name': name,
            'anime': anime,
            'genre': meta['genre'],
            'debutYear': meta['debutYear'],
            'ageDebut': age_debut,
            'ageMain': age_main,
            'studio': meta['studio'],
            'role': role,
            'gender': gender,
            'race': race,
            'debutInfo': f'Personaje de {anime}.',
            'imageFileName': f'{char_id}.png',
            'active': 'True',
            'sourceName': source,
        })
    return built


def main() -> None:
    rows = read_csv_rows()
    additions = build_entries(rows)
    print(f'➕ Nuevas entradas a crear: {len(additions)}')
    if not additions:
        print('Nada que hacer.')
        return

    for entry in additions:
        ensure_image(entry)

    final_rows = rows + [
        {k: v for k, v in entry.items() if k != 'sourceName'}
        for entry in additions
    ]
    write_csv_rows(final_rows)
    print(f'✅ CSV actualizado: {len(final_rows)} personajes')


if __name__ == '__main__':
    main()
