import os
import pdfplumber
import re
import json

def extrair_dados_pdf(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        primeira_pagina = pdf.pages[0]
        texto = primeira_pagina.extract_text()

    cliente_id = re.search(r'Nº DO CLIENTE\s*.*?\n\s*(\d+)', texto, re.IGNORECASE)
    referente_a = re.search(r'Referente a[\s\S]*?(\w{3}/\d{4})', texto)
    energia_eletrica_kwh = re.search(r'Energia Elétrica\s+kWh\s+(\d{1,3}(?:\.\d{3})*)', texto)
    energia_eletrica_valor = re.search(r'Energia Elétrica\s+kWh\s+\d{1,3}(?:\.\d{3})*\s+[\d,.]+\s+([\d,.]+)', texto)
    energia_sceee_kwh = re.search(r'Energia SCEE[\s\S]*?kWh\s+(\d{1,3}(?:\.\d{3})*)', texto, re.IGNORECASE)
    energia_sceee_valor = re.search(r'Energia SCEE[\s\S]*?kWh\s+\d{1,3}(?:\.\d{3})*\s+[\d,.]+\s+([\d,.]+)', texto, re.IGNORECASE)
    energia_compensada_kwh = re.search(r'Energia compensada\s+GD I\s+kWh\s+(\d{1,3}(?:\.\d{3})*)', texto)
    energia_compensada_valor = re.search(r'Energia compensada\s+GD I\s+kWh\s+\d{1,3}(?:\.\d{3})*\s+[\d,.]+\s+([\d,.+-]+)', texto)
    contrib_ilum_publica_valor = re.search(r'Contrib Ilum Publica Municipal\s+([\d,.]+)', texto)

    def converter_valor_float(valor):
        if valor:
            valor = valor.replace('.', '').replace(',', '.')
            try:
                return float(valor)
            except ValueError:
                return 0
        return 0
    
    def converter_valor_int(valor):
        if valor:
            valor = valor.replace('.', '')
            try:
                return int(valor)
            except ValueError:
                return 0
        return 0

    dados_extraidos = {
        "cliente_id": cliente_id.group(1) if cliente_id else 0,
        "referente_a": referente_a.group(1) if referente_a else 0,
        "energia_eletrica_kwh": converter_valor_int(energia_eletrica_kwh.group(1).replace('.', '')) if energia_eletrica_kwh else 0,
        "energia_eletrica_valor": converter_valor_float(energia_eletrica_valor.group(1)) if energia_eletrica_valor else 0,
        "energia_sceee_kwh": converter_valor_int(energia_sceee_kwh.group(1).replace('.', '')) if energia_sceee_kwh else 0,
        "energia_sceee_valor": converter_valor_float(energia_sceee_valor.group(1)) if energia_sceee_valor else 0,
        "energia_compensada_kwh": converter_valor_int(energia_compensada_kwh.group(1)) if energia_compensada_kwh else 0,
        "energia_compensada_valor": converter_valor_float(energia_compensada_valor.group(1)) if energia_compensada_valor else 0,
        "contrib_ilum_publica_valor": converter_valor_float(contrib_ilum_publica_valor.group(1)) if contrib_ilum_publica_valor else 0
    }

    return dados_extraidos

def processar_pasta(pasta_path):
    resultados = []
    
    for filename in os.listdir(pasta_path):
        if filename.endswith(".pdf"):
            file_path = os.path.join(pasta_path, filename)
            dados = extrair_dados_pdf(file_path)
            resultados.append(dados)

    return resultados

pasta_path = "Faturas"
resultados = processar_pasta(pasta_path)

resultados_json = json.dumps(resultados, indent=4, ensure_ascii=False)

print(resultados_json)