# Design Language Translation AI — ID Showflat

https://github.com/SM01-studio/Design-Language-ID/releases/download/untagged-0cf762d2ee320afe682a/ID-01-compressed.mp4

> An AI-powered system that translates vague interior design requirements into quantifiable, professional design specifications for residential showflat projects through a rigorous 6-step interactive workflow.

---

## Overview

Design Language Translation AI bridges the gap between client needs and design execution. It takes non-professional requirement documents (PDF/DOCX/images), processes them through a 6-step AI workflow — grounded in national standards, developer specifications, and real market data — and produces a complete, review-ready design specification package (设计任务书).

The system integrates a RAG (Retrieval-Augmented Generation) knowledge base with 23+ reference documents covering Chinese national building codes, developer fit-out standards, and consumer trend reports, ensuring every design decision is data-driven and standards-compliant.

## 6-Step Workflow

| Step | Name | Description |
|:----:|------|-------------|
| 1 | **Listen** (聆听) | Parse uploaded requirement documents, extract needs hierarchy, map life scenarios, identify design style |
| 2 | **Empathize** (代入) | Build user personas, empathy maps, validate feasibility, predict potential conflicts |
| 3 | **Analyze** (分析) | Scrape market trends, build design parameter matrix, value analysis with trade-off resolution |
| 4 | **Transform** (转化) | Decompose design principles, resolve conflicts, generate design brief draft with quantified specs |
| 5 | **Test** (测试) | AI sales simulation — generate customer survey, simulate 100 respondents, aggregate feedback |
| 6 | **Generate** (生成) | Produce final design brief, risk warnings, and design language interpretation manual |

## Key Features

- **RAG Knowledge Base** — 23+ reference documents (national standards GB/JGJ, developer specs, market reports) indexed with FAISS vector search
- **AI Sales Simulation** — Simulates 100 customer profiles to validate design decisions before execution
- **Real-time Market Intelligence** — Scrapes WeChat, Xiaohongshu, Douyin for live consumer trend data
- **Interactive Workflow** — Step-by-step execution with user confirmation at each stage, supporting selective modifications
- **Professional Export** — Full deliverable package in DOCX and PDF formats with A3 layout, TOC, and standardized formatting
- **Design Style Consistency** — Design style identified in Step 1 flows through all 6 steps to final output

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React, Tailwind CSS v4, Zustand |
| Backend | Flask, SQLite, FAISS |
| AI/LLM | DeepSeek (OpenAI-compatible API) |
| Embeddings | sentence-transformers (paraphrase-multilingual-MiniLM-L12-v2) |
| Web Scraping | Scrapling |
| Export | python-docx, fpdf2 |

## Quick Start

### Prerequisites

- Python 3.12+
- Node.js 18+
- DeepSeek API key

### Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in the project root:

```env
LLM_API_KEY=your_deepseek_api_key
DEV_MODE=true
```

### Knowledge Base Ingestion

```bash
# Full ingestion (first run)
python backend/kb_ingest.py full

# Incremental (add new files only)
python backend/kb_ingest.py incremental
```

Place your reference documents in the `SQ/` directory:
```
SQ/
├── 国家规范/          # National building standards
├── 标准化文件发布/     # Developer specifications
└── 知识库2/           # Market/consumer trend reports
```

### Start Backend

```bash
bash backend/start.sh
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/projects` | Create new project |
| `POST` | `/api/projects/<id>/upload` | Upload requirement documents |
| `POST` | `/api/projects/<id>/execute/<step>` | Execute workflow step (SSE stream) |
| `POST` | `/api/projects/<id>/export` | Export step as DOCX/PDF |
| `GET` | `/api/projects/<id>/export-package` | Download full deliverable ZIP |
| `GET` | `/kb/status` | Knowledge base status |
| `POST` | `/kb/ingest` | Trigger KB ingestion |

## Project Structure

```
Design_language_ID/
├── frontend/                # Next.js 16 application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # React components
│   │   │   ├── steps/       # Step 1-6 result panels
│   │   │   ├── landing/     # Landing page components
│   │   │   ├── onboarding/  # Onboarding overlay
│   │   │   └── common/      # Shared components
│   │   ├── services/        # API client, store
│   │   └── store/           # Zustand state management
│   └── public/              # Static assets
├── backend/
│   ├── api/                 # Flask API blueprints
│   ├── services/            # Business logic
│   │   ├── workflow_engine.py   # 6-step workflow orchestrator
│   │   ├── llm_service.py       # DeepSeek API integration
│   │   ├── kb_service.py        # FAISS vector search
│   │   ├── scrape_service.py    # Web scraping wrapper
│   │   └── export_service.py    # DOCX/PDF generation
│   ├── prompts/             # LLM prompt templates
│   ├── data/                # SQLite database
│   ├── kb_ingest.py         # Knowledge base ingestion
│   └── config.py            # Configuration
├── SQ/                      # Knowledge base source documents
│   ├── 国家规范/
│   ├── 标准化文件发布/
│   └── 知识库2/
└── design-id-skill/         # Claude Code skill definition
```

## License

© 2026 CLD-PDDM AI LAB. All rights reserved.

---

## 概述 | Chinese

Design Language Translation AI 是一款 AI 驱动的室内设计需求翻译系统，专为住宅样板房项目设计。它将非专业的客户需求文档，通过严谨的 6 步交互式工作流，转化为可量化、可执行的设计任务书。

系统集成 RAG 知识库（23+ 份参考文献，涵盖国家标准 GB/JGJ、开发商精装标准、消费趋势报告），结合 FAISS 向量检索、DeepSeek 大模型、社交媒体爬虫，确保每一个设计决策都有据可依、有标可循。

## 工作流程

1. **聆听** — 解析需求文档，提取需求层级，映射生活场景，识别设计风格
2. **代入** — 构建用户画像、共情图，验证可行性，预判冲突
3. **分析** — 爬取市场趋势数据，构建设计参数矩阵，价值分析与权衡消解
4. **转化** — 设计原则拆解、冲突消解，生成含量化参数的设计任务书初稿
5. **测试** — AI 销售模拟：生成客户问卷，模拟 100 组客户反馈，汇总分析
6. **生成** — 输出最终设计任务书、风险预警表、设计语言解读手册

## 核心特性

- **RAG 知识库** — 23+ 份参考文献（国标/行业标准/市场报告），FAISS 向量语义检索
- **AI 销售模拟** — 模拟 100 组客户画像验证设计决策
- **实时市场数据** — 微信、小红书、抖音社交媒体爬虫
- **交互式工作流** — 每步确认，支持选择性修改
- **专业导出** — DOCX/PDF 完整交付包（A3 版面、目录、标准化排版）
- **设计风格贯穿** — 从 Step 1 提取到 Step 6 终稿，风格一致性保证

---

## Resumen | Español

Design Language Translation AI es un sistema impulsado por inteligencia artificial que traduce requisitos vagos de diseño de interiores en especificaciones de diseño cuantificables y profesionales para proyectos de viviendas modelo (showflats).

El sistema integra una base de conocimiento RAG con más de 23 documentos de referencia que cubren códigos nacionales de construcción chinos, especificaciones de acabado de desarrolladores e informes de tendencias del consumidor, garantizando que cada decisión de diseño esté respaldada por datos y cumpla con los estándares.

## Flujo de Trabajo de 6 Pasos

1. **Escuchar** — Analizar documentos de requisitos, extraer jerarquía de necesidades, mapear escenarios de vida
2. **Empatizar** — Crear perfiles de usuario, mapas de empatía, validar factibilidad
3. **Analizar** — Obtener tendencias del mercado, construir matriz de parámetros de diseño
4. **Transformar** — Descomponer principios de diseño, resolver conflictos, generar borrador de especificaciones
5. **Probar** — Simulación de ventas con IA: encuesta a 100 clientes virtuales, análisis agregado
6. **Generar** — Producir especificaciones finales, alertas de riesgo y manual de lenguaje de diseño

## Características Clave

- **Base de conocimiento RAG** — Búsqueda semántica vectorial con FAISS sobre 23+ documentos
- **Simulación de ventas con IA** — 100 perfiles de clientes para validar decisiones de diseño
- **Inteligencia de mercado en tiempo real** — Web scraping de WeChat, Xiaohongshu y Douyin
- **Flujo interactivo** — Confirmación paso a paso con modificaciones selectivas
- **Exportación profesional** — Paquete completo en DOCX y PDF con formato A3

---

## 概要 | 日本語

Design Language Translation AI は、住宅モデルルーム（ショーフラット）プロジェクト向けに、曖昧なインテリア設計要件を定量的かつ専門的な設計仕様書に変換する AI 搭載システムです。

RAG（検索拡張生成）ナレッジベースを統合し、23以上の参考文献（中国国家标准 GB/JGJ、デベロッパー仕様、消費者トレンドレポート）を FAISS ベクトル検索で参照し、すべての設計判断がデータと標準に基づいていることを保証します。

## 6ステップワークフロー

1. **聴取** — 要件文書の解析、ニーズ階層の抽出、ライフシーンのマッピング
2. **共感** — ユーザーペルソナと共感マップの構築、実現可能性の検証
3. **分析** — 市場トレンドデータの取得、設計パラメータマトリックスの構築
4. **変換** — 設計原則の分解、競合の解消、設計仕様書ドラフトの生成
5. **テスト** — AI販売シミュレーション：100組の顧客フィードバックをシミュレーション
6. **生成** — 最終設計仕様書、リスク警告表、デザイン言語解説マニュアルの作成

## 主な機能

- **RAG ナレッジベース** — 23以上の参照文書を FAISS ベクトル検索
- **AI販売シミュレーション** — 100組の顧客プロファイルで設計判断を検証
- **リアルタイム市場データ** — WeChat、小紅書、抖音からのウェブスクレイピング
- **インタラクティブワークフロー** — ステップごとの確認と選択的修正
- **プロフェッショナルなエクスポート** — DOCX/PDF形式の完全な納品パッケージ（A3レイアウト）
