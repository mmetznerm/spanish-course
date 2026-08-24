import json
from pathlib import Path
import fitz
from PIL import Image

ROOT = Path('/mnt/data/espanhol-mapas')
FULL_DIR = ROOT / 'assets' / 'full'
THUMB_DIR = ROOT / 'assets' / 'thumb'
FULL_DIR.mkdir(parents=True, exist_ok=True)
THUMB_DIR.mkdir(parents=True, exist_ok=True)

DATA = [
    # MAPAS 1
    ('mapas1', 1, ['Alfabeto Espanhol', 'Saudações em Espanhol', 'Pronúncia do Espanhol', 'Verbo Ser']),
    ('mapas1', 2, ['Verbo Estar', 'Artigos em Espanhol', 'Preposições de Lugar', 'Números em Espanhol']),
    ('mapas1', 3, ['Verbos Regulares', 'Tempos Verbais', 'Pronomes Pessoais', 'Adjetivos']),
    ('mapas1', 4, ['Pronomes Pessoais Complemento', 'Presente do Indicativo', 'Presente do Subjuntivo', 'Gerúndio em Espanhol']),
    ('mapas1', 5, ['Verbos Irregulares', 'Advérbios de Frequência', 'Perguntas em Espanhol', 'Dias, Meses e Estações']),
    ('mapas1', 6, ['Verbo Tener', 'Adjetivos Possessivos', 'Adjetivos Demonstrativos', 'Cores em Espanhol']),
    ('mapas1', 7, ['Verbo Ir', 'Pronomes Pessoais', 'Pronomes Possessivos', 'Frases Úteis do Dia a Dia']),
    ('mapas1', 8, ['Futuro Simples', 'Comparativos', 'Pretérito Perfeito Composto', 'Verbo Gustar']),
    ('mapas1', 9, ['Verbo Hacer', 'Pretérito Perfeito Simples', 'Ir + A + Infinitivo', 'Vocabulário: Família e Pessoas']),
    ('mapas1', 10, ['Artigos e Substantivos', 'Preposições de Lugar', 'Conjunções Coordenativas', 'Pronomes Demonstrativos']),
    ('mapas1', 11, ['Verbo Estar', 'Verbo Ser', 'Diferença entre Ser e Estar', 'Tempos do Presente']),
    ('mapas1', 12, ['Verbo Tener', 'Verbo Hacer', 'Verbo Venir', 'Verbos Irregulares Importantes']),
    ('mapas1', 13, ['Verbo Ir', 'Usos do Verbo Ir', 'Ir + A + Infinitivo', 'Vocabulário e Expressões com Ir']),
    ('mapas1', 14, ['Verbo Poder', 'Poder: Permissão e Proibição', 'Poder: Possibilidade e Capacidade', 'Frases e Expressões com Poder']),
    ('mapas1', 15, ['Modos Verbais', 'Tempos Verbais', 'Condições de Uso do Subjuntivo', 'Vozes Verbais']),
    ('mapas1', 16, ['Verbos Regulares', 'Transitivos e Intransitivos', 'Formação do Tempo Verbal', 'Conjugação Prática']),
    ('mapas1', 17, ['Verbos de Ação', 'Verbos de Ligação', 'Verbos Auxiliares', 'Verbos Impessoais']),
    ('mapas1', 18, ['Verbos Ser e Estar', 'Verbo Ter', 'Verbo Fazer', 'Verbo Poder']),
    ('mapas1', 19, ['Verbos Pronominais', 'Vozes Verbais', 'Conjugação Verbal', 'Irregulares: Atenção!']),
    ('mapas1', 20, ['Verbos no Infinitivo', 'Verbos Auxiliares', 'Verbos Defectivos', 'Concordância Verbal']),
    # MAPAS 2
    ('mapas2', 1, ['Pronúncia em Espanhol: Guia Completo', 'Acentuação e Sílaba Tônica', 'Ditongos, Tritongos e Hiatos', 'Pronúncia dos Sons que Mais Confundem']),
    ('mapas2', 2, ['No Restaurante e Cafeteria', 'Transporte e Deslocamentos', 'Compras e Lojas', 'Em Conversas do Dia a Dia']),
    ('mapas2', 3, ['Verbo Ser', 'Pronúncia: J x G', 'Artigos em Espanhol', 'Pronomes Possessivos']),
    ('mapas2', 4, ['No Hotel', 'Transportes Públicos', 'Compras e Lojas', 'Em Restaurantes']),
    ('mapas2', 5, ['No Supermercado', 'Em Casa', 'Na Rua e na Cidade', 'Emoções e Sentimentos']),
    ('mapas2', 6, ['No Trabalho e Escritório', 'Tempo e Datas', 'Na Escola e na Faculdade', 'Compras e Lojas']),
    ('mapas2', 7, ['Pedir e Dar Direções', 'Hobbies e Atividades', 'Apresentações e Informações Pessoais', 'Na Farmácia']),
    ('mapas2', 8, ['Expressões para Fazer Amigos', 'Preposições de Lugar', 'Verbos Regulares: Presente do Indicativo', 'Cores em Espanhol']),
    ('mapas2', 9, ['No Restaurante', 'Clima e Estações do Ano', 'Horas e Rotina Diária', 'Roupas e Acessórios']),
    ('mapas2', 10, ['Em Viagens', 'Clima e Tempo', 'Comidas e Bebidas', 'Tecnologia e Internet']),
    ('mapas2', 11, ['Família em Espanhol', 'Profissões em Espanhol', 'Hobbies e Tempo Livre', 'Pronomes Pessoais']),
    ('mapas2', 12, ['Frases para Pedir Informações', 'Roteiro de Viagem na Espanha', 'Comprando no Supermercado', 'Emergências e Saúde']),
    ('mapas2', 13, ['Tempos Verbais - Indicativo', 'Adjetivos: Graus e Posição', 'Palavras Interrogativas', 'Expressões Úteis do Dia a Dia']),
    ('mapas2', 14, ['Ligar e Enviar Mensagens', 'Pedir Ajuda e Oferecer Ajuda', 'No Banco e Caixa Eletrônico', 'Em Situações de Emergência']),
    ('mapas2', 15, ['Na Farmácia', 'Hobbies e Tempo Livre', 'Em Casa: Tarefas Domésticas', 'No Cinema e Teatro']),
    ('mapas2', 16, ['Conversas no Aeroporto', 'Vocabulário no Restaurante', 'Verbos no Presente', 'Dias, Meses e Estações']),
    ('mapas2', 17, ['Falsos Cognatos', 'Gênero dos Substantivos', 'Advérbios de Frequência', 'Conjugação: Verbo Tener']),
    ('mapas2', 18, ['Compras e Lojas', 'Transporte e Viagem', 'Família e Parentesco', 'Hotel e Acomodação']),
    ('mapas2', 19, ['Ordem das Palavras em Espanhol', 'Pronomes Pessoais', 'Verbos Irregulares Mais Usados', 'Conectores e Conjunções']),
    ('mapas2', 20, ['Preposições em Espanhol', 'Presente dos Verbos Regulares', 'Plural dos Substantivos', 'Frases Interrogativas']),
]

PDFS = {
    'mapas1': '/mnt/data/MAPASMENTAIS_1.pdf',
    'mapas2': '/mnt/data/MAPASMENTAIS_2.PDF',
}


def slugify(s: str) -> str:
    repl = {
        'á':'a','à':'a','ã':'a','â':'a','é':'e','ê':'e','í':'i','ó':'o','ô':'o','õ':'o','ú':'u','ç':'c',
        'Á':'a','À':'a','Ã':'a','Â':'a','É':'e','Ê':'e','Í':'i','Ó':'o','Ô':'o','Õ':'o','Ú':'u','Ç':'c',
    }
    out = ''.join(repl.get(ch, ch.lower()) for ch in s)
    keep = []
    prev_dash = False
    for ch in out:
        if ch.isalnum():
            keep.append(ch)
            prev_dash = False
        else:
            if not prev_dash:
                keep.append('-')
                prev_dash = True
    return ''.join(keep).strip('-')


def category_for(title: str) -> str:
    t = title.lower()
    if any(k in t for k in ['pronúncia', 'pronuncia', 'acentuação', 'silaba', 'ditongos', 'sons', 'j x g']):
        return 'Pronúncia'
    if any(k in t for k in ['verbo', 'verbos', 'pretérito', 'subjuntivo', 'indicativo', 'gerúndio', 'futuro', 'conjugação', 'concordância', 'tempos verbais', 'vozes verbais', 'modos verbais']):
        return 'Verbos'
    if any(k in t for k in ['restaurante', 'hotel', 'supermercado', 'casa', 'trabalho', 'escola', 'faculdade', 'farmácia', 'aeroporto', 'viagens', 'viagem', 'banco', 'emergência', 'mensagens', 'direções', 'transporte', 'rua', 'cidade', 'cinema', 'teatro', 'cafeteria']):
        return 'Situações'
    if any(k in t for k in ['família', 'profissões', 'roupas', 'comidas', 'tecnologia', 'hobbies', 'cores', 'emoções', 'compras', 'vocabulário', 'tempo e datas', 'clima', 'horas', 'rotina']):
        return 'Vocabulário'
    return 'Gramática'


def tags_for(title: str, source: str) -> list[str]:
    tags = [category_for(title), source]
    parts = [p.strip() for p in title.replace(':', ' ').replace('-', ' ').replace('+', ' ').split()]
    for p in parts:
        p = p.strip(',.!?()').lower()
        if len(p) >= 3 and p not in ['dos','das','del','para','com','sem','que','mais']:
            tags.append(p)
    return sorted(dict.fromkeys(tags), key=str.lower)


def render_all():
    items = []
    for source, page_num, titles in DATA:
        doc = fitz.open(PDFS[source])
        page = doc[page_num - 1]
        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
        img = Image.frombytes('RGB', [pix.width, pix.height], pix.samples)
        w, h = img.size
        boxes = [
            (0, 0, w // 2, h // 2),
            (w // 2, 0, w, h // 2),
            (0, h // 2, w // 2, h),
            (w // 2, h // 2, w, h),
        ]
        for idx, (title, box) in enumerate(zip(titles, boxes), start=1):
            crop = img.crop(box)
            item_id = f'{source}-p{page_num:02d}-q{idx}'
            slug = slugify(title)
            full_name = f'{item_id}-{slug}.webp'
            thumb_name = f'{item_id}-{slug}-thumb.webp'
            full_path = FULL_DIR / full_name
            thumb_path = THUMB_DIR / thumb_name
            crop.save(full_path, 'WEBP', quality=84, method=6)
            thumb = crop.copy()
            thumb.thumbnail((360, 360))
            thumb.save(thumb_path, 'WEBP', quality=72, method=6)
            items.append({
                'id': item_id,
                'title': title,
                'category': category_for(title),
                'source': 'Mapas Mentais 1' if source == 'mapas1' else 'Mapas Mentais 2',
                'pdfKey': source,
                'page': page_num,
                'quadrant': idx,
                'full': f'assets/full/{full_name}',
                'thumb': f'assets/thumb/{thumb_name}',
                'tags': tags_for(title, 'mapas1' if source == 'mapas1' else 'mapas2'),
            })
    return items


items = render_all()
(items and ROOT.mkdir(exist_ok=True))
with open(ROOT / 'data.js', 'w', encoding='utf-8') as f:
    f.write('window.MAPAS_DATA = ')
    json.dump(items, f, ensure_ascii=False, indent=2)
    f.write(';\n')

print(f'Generated {len(items)} cards')
