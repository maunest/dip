from pdf_reader import text_from_pdf
from transformers import BartTokenizer, BartForConditionalGeneration
import sys


def generate_summary(article_text):
    # Загрузка предобученного токенизатора и модели BART для абстрактной суммаризации
    tokenizer = BartTokenizer.from_pretrained('facebook/bart-large-cnn')
    model = BartForConditionalGeneration.from_pretrained('facebook/bart-large-cnn')

    # Токенизация и подготовка текста статьи для абстрактной суммаризации
    inputs = tokenizer([article_text], max_length=1024, return_tensors='pt', truncation=True, padding=True)

   

    # Генерация аннотации
    summary_ids = model.generate(inputs.input_ids, max_length=1024, num_beams=5, early_stopping=True)

    # Декодирование аннотации
    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)

    #inputs2 = tokenizer([article_text[1024:]], max_length=1024, return_tensors='pt', truncation=True, padding=True)
    #summary_ids2 = model.generate(inputs2.input_ids, max_length=1024, num_beams=5, early_stopping=True)
    #summary2 = tokenizer.decode(summary_ids2[0], skip_special_tokens=True)

    return summary # + summary2

def main(pdf_file_path):
    article_text = text_from_pdf(pdf_file_path)
    summary = generate_summary(article_text)
    print(summary)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(1)
    
    pdf_file_path = sys.argv[1]
    main(pdf_file_path)
