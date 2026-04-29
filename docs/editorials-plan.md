# Editorial Reviews — Plan & Log

Add an editorial assessment to every school in the index, replacing the current "Independent review not yet published" placeholder where it appears.

## Prompt (reference for every write)

Write a 2-paragraph editorial assessment of {school name}, in the voice of an independent guide.

**Paragraph 1** — what the school is known for. Lead with its strongest signal (academic standing, heritage, distinctive pathway, scale). Cite parent and community feedback in general terms ("parents consistently cite…", "the community widely regards…").

**Paragraph 2** — what to watch. Note any consistent concerns from the parent community (waitlists, social pressure, fee inflation, leadership turnover, whatever applies). Keep it measured — don't overstate minority views.

**Rules:**
- Never name specific platforms (no "Reddit", "Facebook", "Quora", "forums")
- Never expose ranking mechanics (no fee scores, penalty %, adjusted scores)
- Use the framing "parent and community feedback" / "our team"
- 100–180 words total
- No marketing copy, no superlatives without basis, no claims you cannot defend

## Process per school

1. Open this doc and re-read the prompt above
2. Pick the next ⬜ row in the log
3. Write the editorial in line with the prompt
4. Set `hasEditorial: true` and `editorial: "..."` in `src/data/schools.json`
5. Update log row → ✅
6. Move to next; deploy at the end of each city batch

## Log

Status: ⬜ pending · ✅ done · ♻️ rewritten (existing editorial replaced)

### Singapore

| # | School | Status |
|---|---|---|
| 1 | Tanglin Trust School | ♻️ rewritten (148 words) |
| 2 | Dulwich College (Singapore) | ✅ (135 words) |
| 3 | Brighton College (Singapore) | ✅ (140 words) |
| 4 | Nexus International School | ✅ (147 words) |

### Hong Kong

| # | School | Status |
|---|---|---|
| 5 | Yew Chung International School of Hong Kong | ✅ (151 words) |
| 6 | Kellett School | ✅ (151 words) |
| 7 | German Swiss International School | ✅ (151 words) |
| 8 | Harrow International School Hong Kong | ✅ (148 words) |
| 9 | Nord Anglia International School Hong Kong | ✅ (143 words) |
| 10 | Wycombe Abbey School Hong Kong | ✅ (149 words) |
| 11 | Discovery Bay International School | ✅ (150 words) |

### Bangkok

| # | School | Status |
|---|---|---|
| 12 | Shrewsbury International School Bangkok | ✅ (152 words) |
| 13 | Wellington College International School Bangkok | ✅ (148 words) |
| 14 | Brighton College Bangkok | ✅ (150 words) |
| 15 | Harrow International School Bangkok | ✅ (151 words) |
| 16 | Denla British School | ✅ (158 words) |
| 17 | Bangkok Patana School | ✅ (150 words) |
| 18 | St Andrews International School Bangkok | ✅ (145 words) |
| 19 | Bromsgrove International School Thailand | ✅ (155 words) |

### Kuala Lumpur

| # | School | Status |
|---|---|---|
| 20 | Alice Smith School | ✅ (159 words) |
| 21 | Garden International School | ✅ (162 words) |
| 22 | British International School of Kuala Lumpur | ✅ (149 words) |

### Shanghai

| # | School | Status |
|---|---|---|
| 23 | Dulwich College Shanghai Pudong | ✅ (159 words) |
| 24 | Dulwich College Shanghai Puxi | ✅ (149 words) |
| 25 | Harrow International School Shanghai | ✅ (145 words) |
| 26 | Wellington College International Shanghai | ✅ (154 words) |
| 27 | Nord Anglia International School Shanghai, Pudong | ✅ (152 words) |
| 28 | The British International School Shanghai, Puxi | ✅ (150 words) |
| 29 | Britannica International School Shanghai | ✅ (160 words) |

### Beijing

| # | School | Status |
|---|---|---|
| 30 | The British School of Beijing, Sanlitun | ✅ (153 words) |
| 31 | The British School of Beijing, Shunyi | ✅ (156 words) |

### Shenzhen

| # | School | Status |
|---|---|---|
| 32 | Harrow International School Shenzhen | ✅ (160 words) |

### Tokyo

| # | School | Status |
|---|---|---|
| 33 | The British School in Tokyo | ✅ (158 words) |

### Hanoi

| # | School | Status |
|---|---|---|
| 34 | British International School Hanoi | ✅ (160 words) |

### Ho Chi Minh City

| # | School | Status |
|---|---|---|
| 35 | British International School Ho Chi Minh City | ✅ (158 words) |

### Jakarta

| # | School | Status |
|---|---|---|
| 36 | The Independent School of Jakarta | ✅ (155 words) |
| 37 | British School Jakarta | ✅ (162 words) |

## Cycle

Deploy at the end of each city section. After deploying, hard-refresh a sample profile to verify the editorial section now renders the new content.
