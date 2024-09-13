from datetime import date

from fastapi.exceptions import HTTPException

from services.mood_entry import MoodEntryService
from services.context_factor import ContextFactorService
from services.effect import EffectService
from services.emotion import EmotionService
from services.mood_emotion import MoodEmotionService


class AnalyticsService:
    def __init__(
            self,
            context_factor_serv: ContextFactorService,
            effect_serv: EffectService,
            mood_entry_serv: MoodEntryService,
            mood_emotion_serv: MoodEmotionService,
            emotion_serv: EmotionService
    ):
        self.context_factor_serv = context_factor_serv
        self.effect_serv = effect_serv
        self.mood_entry_serv = mood_entry_serv
        self.mood_emotion_serv = mood_emotion_serv
        self.emotion_serv = emotion_serv

    async def get_analytics(
            self,
            user_id: int,
            start_date: date | None = None,
            end_date: date | None = None,
            delete_names: list | None = None
    ) -> dict:
        if delete_names is None:
            delete_names = []
        try:
            mood_entries = await self.mood_entry_serv.get_paginated_mood_entries_by_user_id_by_date(
                user_id=user_id,
                start_date=start_date,
                end_date=end_date,
                cursor=None,
                limit=10000000
            )
            length = len(mood_entries.items)
            mood_entry_stats_chart = [
                {
                    "name": "general_well_being",
                    "mean": 0
                },
                {
                    "name": "energy_level",
                    "mean": 0
                },
                {
                    "name": "stress_level",
                    "mean": 0
                },
                {
                    "name": "sleep_quality",
                    "mean": 0
                },
            ]

            context_factor_values = {}
            emotion_values_by_date = {}
            emotion_radar_values = {}

            for item in mood_entries.items:

                mood_entry_stats_chart[0]["mean"] += item.general_well_being
                mood_entry_stats_chart[1]["mean"] += item.energy_level
                mood_entry_stats_chart[2]["mean"] += item.stress_level
                mood_entry_stats_chart[3]["mean"] += item.sleep_quality

                for mood_emotion in item.mood_emotions:
                    name = (await self.emotion_serv.get_emotion_by_id(
                        mood_emotion.emotion_id
                    )).name

                    if name in delete_names:
                        continue

                    if name not in emotion_radar_values:
                        emotion_radar_values[name] = 1
                    else:
                        emotion_radar_values[name] += 1

                    if item.entry_date not in emotion_values_by_date:
                        emotion_values_by_date[
                            item.entry_date
                        ] = [
                            {
                                name: mood_emotion.intensity
                            }
                        ]
                    else:
                        emotion_values_by_date[
                            item.entry_date
                        ].append(
                            {
                                name: mood_emotion.intensity
                            }
                        )

                for mood_context in item.mood_contexts:
                    name = (await self.context_factor_serv.get_context_factor_by_id(
                                mood_context.context_factor_id
                            )).name
                    value = (await self.effect_serv.get_effect_by_id(
                                mood_context.effect_id,
                                convert_to_nums=True
                            ))
                    if name not in context_factor_values:
                        context_factor_values[name] = [value, 1]
                    else:
                        context_factor_values[name][0] += value
                        context_factor_values[name][1] += 1

            for stat in mood_entry_stats_chart:
                stat["mean"] = round(stat["mean"] / length, 2)

            emotion_line_chart = []

            for day, emotions in (
                sorted(
                    emotion_values_by_date.items()
                )
            ):
                emotion_line_chart.append(
                    {
                        "date": day,
                        **{list(d.keys())[0]: list(d.values())[0] for d in emotions}
                    }
                )
            emotion_sum = sum(emotion_radar_values.values())
            emotion_radar_chart = [
                {
                    "name": emotion,
                    "value": round(value / emotion_sum, 2)
                }
                for emotion, value in emotion_radar_values.items()
            ]
            context_factor_chart = [
                {
                    "name": key,
                    "mean": round(value[0] / value[1], 2)
                }
                for key, value in context_factor_values.items()
            ]
            analytics = {
                "mood_entry_stats_chart": mood_entry_stats_chart,
                "context_factor_chart": context_factor_chart,
                "emotion_line_chart": emotion_line_chart,
                "emotion_radar_chart": emotion_radar_chart
            }

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        return analytics
