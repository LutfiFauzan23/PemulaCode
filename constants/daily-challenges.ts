export type DailyChallenge = { id: string; topic: 'HTML' | 'CSS' | 'JavaScript'; question: string; options: string[]; answer: number; explanation: string };

export const dailyChallengeBank: DailyChallenge[] = [
  { id: 'html-heading', topic: 'HTML', question: 'Tag HTML manakah yang digunakan untuk membuat judul paling besar?', options: ['<head>', '<h6>', '<h1>', '<title>'], answer: 2, explanation: '<h1> digunakan untuk judul utama dengan tingkat heading paling besar.' },
  { id: 'css-background', topic: 'CSS', question: 'Properti CSS apa yang digunakan untuk mengubah warna latar belakang suatu elemen?', options: ['color', 'background-color', 'bgcolor', 'fill-color'], answer: 1, explanation: 'background-color digunakan untuk mengatur warna latar belakang elemen.' },
  { id: 'js-concat', topic: 'JavaScript', question: "Apa hasil dari perintah JavaScript: console.log(2 + '2')?", options: ['4', "'22'", 'NaN', 'Error'], answer: 1, explanation: 'Karena salah satu operand adalah string, operator + menggabungkan keduanya menjadi string 22.' },
  { id: 'html-link', topic: 'HTML', question: 'Tag HTML apa yang digunakan untuk membuat tautan?', options: ['<link>', '<a>', '<href>', '<url>'], answer: 1, explanation: 'Tag <a> (anchor) digunakan untuk membuat tautan.' },
  { id: 'css-flex', topic: 'CSS', question: 'Properti CSS apa yang mengaktifkan layout Flexbox?', options: ['position: flex', 'layout: flex', 'display: flex', 'flex: on'], answer: 2, explanation: 'display: flex mengubah elemen menjadi flex container.' },
  { id: 'js-const', topic: 'JavaScript', question: 'Keyword apa yang digunakan untuk deklarasi variabel yang tidak dapat di-assign ulang?', options: ['var', 'let', 'const', 'fixed'], answer: 2, explanation: 'const membuat binding yang tidak dapat di-assign ulang.' },
  { id: 'html-image', topic: 'HTML', question: 'Atribut apa yang memberi teks alternatif pada gambar?', options: ['title', 'alt', 'caption', 'text'], answer: 1, explanation: 'Atribut alt membantu aksesibilitas dan ditampilkan saat gambar gagal dimuat.' },
];

export function getDailyChallenge(date = new Date()): DailyChallenge {
  const dayOfYear = Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 86400000);
  return dailyChallengeBank[(dayOfYear - 1) % dailyChallengeBank.length];
}

export function getChallengeDateKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
