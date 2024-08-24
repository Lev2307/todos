

import { sql } from '@vercel/postgres';

import { TodoField, TELEGRAM_TOKEN, User } from "./definitions";

const TelegramBot = require('node-telegram-bot-api');
export const bot = new TelegramBot(TELEGRAM_TOKEN);

export function DueTimeValidation(due_time: string) {
    // check if due_time is not in the past
    const due_time_validation = new Date(due_time);
    const now = new Date();
    if (!due_time_validation) {
        return false;
    }
    if (due_time_validation > now) {
        return true;
    }
    return false;
}

export function getISOStringWithoutSecsAndMillisecs(date: Date) {
    // format date to input datetime-local default value type
    const dateAndTime = date.toISOString().split('T')
    const time = dateAndTime[1].split(':')
    
    return dateAndTime[0]+'T'+time[0]+':'+time[1]
  }

export async function checkTodoIsFinished(todo: TodoField, telegram_chat_id: number | null) {
    const now = new Date();
    const todo_due_time = new Date(todo.due_time);
    if (todo_due_time < now) {
        try {
            await sql`UPDATE todos 
                    SET is_active=${false},
                        due_time=${now.toISOString()}
                    WHERE id=${todo.id}`;
            bot.sendMessage(telegram_chat_id, `Your todo is now finished -_- 📝\n Tag ${todo.tag}\n Title ${todo.title}\n Desc ${todo.text}\n Was finished on ${now.toLocaleString()}\nWe hope you did it till current time 🤔`)
        } catch (error) {
            throw error;
        }
    }
}