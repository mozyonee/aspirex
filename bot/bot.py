import config
import telebot
import requests
import re

bot = telebot.TeleBot(config.BOT_TOKEN)

def ban_user(email):
    try:
        response = requests.post(f'{config.SERVER_URL}/ban', json={'email': email})
        if response.status_code != 200:
            return "Failed to ban user."
        else:
            return "User banned successfully."
    except Exception as e:
        return f"Error: {str(e)}"

@bot.message_handler(commands=['ban'])
def ban_command(message):
    email = message.text.split(' ', 1)[1]
    if '@' in email:
        response = ban_user(email)
        bot.reply_to(message, response)
    else:
        bot.reply_to(message, "Invalid email format.")

@bot.message_handler(commands=['live'])
def live_command(message):
    email = message.text.split(' ', 1)[1]
    if '@' in email:
        try:
            response = requests.post(f'{config.SERVER_URL}/live', json={'email': email})
            if response.status_code == 200:
                bot.send_message(message.chat.id, f"You switched live chat to {email}.")
            else:
                bot.send_message(message.chat.id, "Failed to send information.")
        except Exception as e:
            bot.send_message(message.chat.id, f"Error: {str(e)}")
    else:
        bot.reply_to(message, "Invalid email format.")

def extract_socket_from_message(message):
    pattern = r'Socket\s+ID:\s+([\w-]+)\.'
    match = re.search(pattern, message)
    socket = match.group(1) if match else None
    return socket

@bot.message_handler(func=lambda message: True, content_types=["text"])
def echo_reply(message):
    if message.reply_to_message is not None and message.reply_to_message.text:
        replied_message_text = message.reply_to_message.text
        answer_message_text = message.text

        socket = extract_socket_from_message(replied_message_text)

        if socket:
            data = {
                'socket': socket,
                'name': 'Agent',
                'message': answer_message_text
            }

            try:
                response = requests.post(f'{config.SERVER_URL}/bot', json=data)
                if response.status_code != 200:
                    bot.send_message(message.chat.id, "Failed to send information.")
            except Exception as e:
                bot.send_message(message.chat.id, f"Error: {str(e)}")
        else:
            bot.send_message(message.chat.id, f"Wrong socket: {socket}")

if __name__ == '__main__':
    bot.infinity_polling()