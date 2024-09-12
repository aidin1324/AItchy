import os
from datetime import datetime

from dotenv import load_dotenv
from fastapi.exceptions import HTTPException

from models import User
from services.notes import NotesService

import tiktoken
import openai

load_dotenv()


class OpenAIAPIService:
    sys_settings = """
        You are an individual assistant in russian designed to help user analyze and understand their emotional and mental states based on their personal journal entries. Your role is to provide a supportive and empathetic response to user based on gender and age, focusing on the following tasks:
        1. Interpretation:
           - Summarize the user's journal entry in 2-3 sentences. Provide a brief overview of the main topics or feelings expressed by the author. Consider the user's profile information, including their gender and age, to tailor the interpretation appropriately.
        2. Identification of Issues:
           - Analyze the entry to identify any emotional, mental, or situational problems. Look for hidden signs of distress, unresolved issues, or areas of concern. If the entry highlights positive aspects, such as joyful moments or achievements, acknowledge and praise these. Utilize the user's profile details, including gender and age, to offer insights that are relevant and avoid stereotypes.
        3. Recommendations:
           - Based on the issues identified or the positive achievements noted, provide 2-3 practical and supportive recommendations. These could be strategies to address specific problems mentioned or suggestions to build on the positive progress observed in the entry. Tailor recommendations considering the user's gender, age, and profile information to make them as relevant and effective as possible.
        Remember to be empathetic and supportive, ensuring your feedback helps users feel understood and motivated to explore and improve their emotional well-being. Avoid generalizations and ensure that advice is sensitive to individual differences and needs.
        """
    openai.api_key = os.getenv("OPENAI_API_KEY")

    def __init__(
            self,
            note_serv: NotesService
    ):
        self.note_serv = note_serv
        self.model = "gpt-4o-mini"
        self.encoding = tiktoken.encoding_for_model("gpt-4o-mini")

    async def analyze_daily_entry(
            self,
            user: User,
            note_id: int
    ):
        try:
            entry_content = (await self.note_serv.get_note_by_id(note_id)).content

            if len(self.encoding.encode(entry_content)) > 4000:
                raise HTTPException(
                    status_code=404,
                    detail="Too many for analysis!"
                )
            age = (datetime.today().year - user.birth_date.year -
                   ((datetime.today().month, datetime.today().day) <
                    (user.birth_date.month, user.birth_date.day)))
            profile = f"Имя: {user.name}, {age}лет, {user.gender}"

            response = openai.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": self.sys_settings},
                    {"role": "user", "content": profile + entry_content}
                ],
                max_tokens=1500,
                temperature=0.7,
                top_p=0.9,

                frequency_penalty=0.2,
                presence_penalty=0.2
            )

        except Exception as e:
            raise HTTPException(400, detail=str(e))

        return {
                "note_id": note_id,
                "response": response.choices[0].message.content
        }