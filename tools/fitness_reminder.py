#!/usr/bin/env python3
import os
import sys
import urllib.parse
import urllib.request
from datetime import date, datetime
from zoneinfo import ZoneInfo


START_DATE = date.fromisoformat(os.getenv("FITNESS_START_DATE", "2026-07-19"))

PLAN = [
    [
        "45 min treadmill + 10 min zina",
        "50 min treadmill",
        "40 min treadmill + 15 min zina",
        "50 min treadmill",
        "45 min treadmill + 15 min zina",
        "60 min treadmill",
        "Dam / 8-10k qadam",
    ],
    [
        "45 min treadmill + 15 min zina",
        "55 min treadmill",
        "40 min treadmill + 15 min zina",
        "55 min treadmill",
        "45 min treadmill + 20 min zina",
        "65 min treadmill",
        "Dam / 8-10k qadam",
    ],
    [
        "50 min treadmill + 15 min zina",
        "60 min treadmill",
        "45 min treadmill + 20 min zina",
        "60 min treadmill",
        "50 min treadmill + 20 min zina",
        "70 min treadmill",
        "Faol dam",
    ],
    [
        "50 min treadmill + 20 min zina",
        "60 min treadmill",
        "45 min treadmill + 20 min zina",
        "60 min treadmill",
        "50 min treadmill + 25 min zina",
        "75 min treadmill",
        "Dam",
    ],
    [
        "55 min treadmill + 20 min zina",
        "65 min treadmill",
        "50 min treadmill + 25 min zina",
        "65 min treadmill",
        "55 min treadmill + 25 min zina",
        "80 min treadmill",
        "Faol dam",
    ],
    [
        "55 min treadmill + 25 min zina",
        "70 min treadmill",
        "50 min treadmill + 25 min zina",
        "70 min treadmill",
        "55 min treadmill + 30 min zina",
        "85 min treadmill",
        "Dam",
    ],
    [
        "60 min treadmill + 25 min zina",
        "70 min treadmill",
        "55 min treadmill + 30 min zina",
        "70 min treadmill",
        "60 min treadmill + 30 min zina",
        "90 min treadmill",
        "Faol dam",
    ],
    [
        "60 min treadmill + 30 min zina",
        "75 min treadmill",
        "55 min treadmill + 30 min zina",
        "75 min treadmill",
        "60 min treadmill + 35 min zina",
        "90 min treadmill",
        "Dam",
    ],
]

TREADMILL_SETTINGS = [
    "5.8-6.0 km/soat, incline 1-2%",
    "5.8-6.0 km/soat, incline 1-2%",
    "6.0-6.2 km/soat, incline 2-3%",
    "6.0-6.2 km/soat, incline 2-3%",
    "6.2-6.4 km/soat, incline 3-5%",
    "6.2-6.4 km/soat, incline 3-5%",
    "6.3-6.5 km/soat, incline 5-6%",
    "6.3-6.5 km/soat, incline 5-6%",
]

STAIR_SETTINGS = [
    "Level 3-4",
    "Level 3-4",
    "Level 4-5",
    "Level 4-5",
    "Level 5-6",
    "Level 5-6",
    "Level 6-7",
    "Level 6-7",
]


def build_message(today: date) -> str:
    day_index = (today - START_DATE).days
    if day_index < 0:
        return f"Reja hali boshlanmagan. Start sanasi: {START_DATE.isoformat()}"
    if day_index >= 56:
        return "8 haftalik reja tugadi. Bugun progressni ko'rib chiqish va yangi bosqichni tanlash kuni."

    week_index = day_index // 7
    day_in_week = day_index % 7
    workout = PLAN[week_index][day_in_week]

    return "\n".join(
        [
            f"Bugun: {today.isoformat()}",
            f"{week_index + 1}-hafta, {day_in_week + 1}-kun",
            "",
            f"Reja: {workout}",
            f"Treadmill: {TREADMILL_SETTINGS[week_index]}",
            f"Zina: {STAIR_SETTINGS[week_index]}",
            "",
            "Tartib:",
            "- Warm-up: 5 daqiqa",
            "- Asosiy mashg'ulot",
            "- Cool-down: 3-5 daqiqa",
            "- Cho'zilish",
            "",
            "Checklist:",
            "- 3 litr suv",
            "- Oqsilga boy ovqat",
            "- 8-10 ming qadam",
            "- 7.5+ soat uyqu",
            "- Shirin ichimlik yo'q",
            "",
            "[[8 haftalik kardio reja]]",
        ]
    )


def send_telegram(message: str) -> None:
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    chat_id = os.getenv("TELEGRAM_CHAT_ID")
    if not token or not chat_id:
        print(message)
        print("\nTELEGRAM_BOT_TOKEN va TELEGRAM_CHAT_ID kiritilmagan, xabar faqat terminalga chiqarildi.")
        return

    data = urllib.parse.urlencode({"chat_id": chat_id, "text": message}).encode()
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    with urllib.request.urlopen(url, data=data, timeout=20) as response:
        if response.status != 200:
            raise RuntimeError(f"Telegram API status: {response.status}")


def main() -> int:
    today_arg = sys.argv[1] if len(sys.argv) > 1 else None
    timezone = ZoneInfo(os.getenv("TZ", "Asia/Tashkent"))
    today = date.fromisoformat(today_arg) if today_arg else datetime.now(timezone).date()
    send_telegram(build_message(today))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
