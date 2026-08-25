# 📚 PemulaCode - Challenge JSON Documentation

Dokumentasi ini menjelaskan struktur file JSON yang digunakan pada fitur **Coding Challenge** di aplikasi **PemulaCode**.

---

# Struktur Folder

```text
data/
└── challenges/
    ├── html/
    ├── css/
    └── javascript/
```

Contoh:

```text
data/challenges/html/basic-001.json
```

---

# Struktur JSON

```json
{
  "id": "html-css-001",
  "title": "Tombol Merah",
  "difficulty": "Easy",
  "category": "HTML",
  "xp": 20,

  "description": "Buat tombol merah dengan tulisan Submit.",

  "starterCode": {
    "html": "",
    "css": "",
    "js": ""
  },

  "tests": [
    {
      "id": 1,
      "type": "selector",
      "selector": "button",
      "message": "Harus terdapat elemen <button>"
    },
    {
      "id": 2,
      "type": "text",
      "selector": "button",
      "expected": "Submit",
      "message": "Teks tombol harus 'Submit'"
    },
    {
      "id": 3,
      "type": "css",
      "selector": "button",
      "property": "background-color",
      "expected": "rgb(255, 0, 0)",
      "message": "Background tombol harus berwarna merah"
    }
  ],

  "solution": {
    "html": "<button>Submit</button>",
    "css": "button { background:red; color:white; }",
    "js": ""
  },

  "hint": [
    "Gunakan elemen button.",
    "Gunakan CSS background-color."
  ]
}
```

---

# Penjelasan Setiap Field

## id

ID unik challenge.

Harus unik.

Contoh:

```json
"id": "html-001"
```

Digunakan untuk:

* Menyimpan progress user
* Bookmark
* Statistik
* Leaderboard

---

## title

Judul challenge.

Contoh:

```json
"title": "Heading Pertama"
```

Ditampilkan pada daftar challenge.

---

## difficulty

Tingkat kesulitan.

Nilai yang diperbolehkan:

```text
Easy
Medium
Hard
Expert
```

---

## category

Kategori challenge.

Contoh:

```text
HTML
CSS
JavaScript
```

---

## xp

Jumlah XP yang diberikan setelah challenge selesai.

Contoh:

```json
"xp": 50
```

---

## description

Instruksi challenge.

Contoh:

```json
"description": "Buat tombol merah dengan tulisan Submit."
```

Ditampilkan kepada pengguna sebelum mengerjakan challenge.

---

# starterCode

Kode awal yang akan langsung muncul di editor.

Contoh:

```json
"starterCode": {
    "html": "<button></button>",
    "css": "",
    "js": ""
}
```

Jika dikosongkan:

```json
"starterCode": {
    "html": "",
    "css": "",
    "js": ""
}
```

Editor akan kosong.

---

# tests

Bagian terpenting.

**JANGAN gunakan solution untuk menilai jawaban user.**

Penilaian harus menggunakan test.

---

## type = selector

Memastikan elemen tertentu ada.

Contoh:

```json
{
    "type":"selector",
    "selector":"button"
}
```

Artinya:

Harus terdapat elemen

```html
<button>
```

---

## type = text

Memastikan isi teks suatu elemen.

Contoh:

```json
{
    "type":"text",
    "selector":"button",
    "expected":"Submit"
}
```

Artinya:

Button harus memiliki tulisan

```text
Submit
```

---

## type = css

Memastikan properti CSS.

Contoh:

```json
{
    "type":"css",
    "selector":"button",
    "property":"background-color",
    "expected":"rgb(255, 0, 0)"
}
```

Artinya:

Background button harus merah.

---

## selector

Menggunakan CSS Selector.

Contoh:

```text
button

h1

.card

#navbar

.container button

input[type=email]
```

---

## property

Nama properti CSS.

Contoh:

```text
background-color

color

display

width

height

margin

padding

border

border-radius

font-size

font-weight

justify-content

align-items

flex-direction

position
```

---

## expected

Nilai yang diharapkan.

Contoh:

```json
"expected":"Submit"
```

atau

```json
"expected":"rgb(255,0,0)"
```

---

## message

Pesan jika test gagal.

Contoh:

```json
"message":"Button harus berwarna merah."
```

---

# solution

Jawaban resmi challenge.

Digunakan untuk:

* Lihat Solusi
* Referensi admin
* Dokumentasi
* Debugging

Contoh:

```json
"solution":{
    "html":"<button>Submit</button>",
    "css":"button{background:red;color:white;}",
    "js":""
}
```

---

# hint

Petunjuk yang dapat ditampilkan kepada pengguna.

Contoh:

```json
"hint":[
    "Gunakan tag button.",
    "Gunakan CSS background-color."
]
```

---

# Alur Challenge

```text
User membuka challenge
        │
        ▼
Starter Code ditampilkan
        │
        ▼
User menulis HTML/CSS/JS
        │
        ▼
Klik tombol RUN
        │
        ▼
Kode dijalankan
        │
        ▼
Sistem membaca tests[]
        │
        ▼
Semua test PASS?
        │
   ┌────┴────┐
   │         │
  Ya       Tidak
   │         │
   ▼         ▼
XP      Tampilkan
Ditambah Pesan Error
```

---

# Menambahkan Challenge Baru

1. Buat file JSON baru.

Contoh:

```text
html-002.json
```

2. Isi metadata challenge.

3. Isi starterCode.

4. Tambahkan tests.

5. Tambahkan solution.

6. Tambahkan hint.

Selesai.

---

# Best Practice

✅ Gunakan ID yang unik.

✅ Jangan gunakan solution untuk mengecek jawaban.

✅ Selalu gunakan tests.

✅ Berikan minimal satu hint.

✅ Berikan XP sesuai tingkat kesulitan.

---

# Rekomendasi XP

| Difficulty |  XP |
| ---------- | --: |
| Easy       |  20 |
| Medium     |  40 |
| Hard       |  75 |
| Expert     | 120 |

---

# Penamaan File

Disarankan menggunakan format berikut:

```text
html-001.json
html-002.json
html-003.json

css-001.json
css-002.json

js-001.json
js-002.json
```

Atau:

```text
basic-heading.json
html-table.json
css-flexbox.json
js-dom-event.json
```

Gunakan satu format secara konsisten di seluruh project.

---

# Catatan

`solution` digunakan untuk referensi dan fitur **Lihat Solusi**, sedangkan seluruh proses validasi challenge **harus menggunakan `tests`**. Dengan pendekatan ini, pengguna tetap dapat menyelesaikan challenge menggunakan berbagai solusi yang valid selama semua aturan pada `tests` terpenuhi.
