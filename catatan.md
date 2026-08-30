# CATATAN — CUSTOM BOTTOM NAVBAR

File utama yang mengatur Bottom Navbar:

```text
app/(tabs)/_layout.tsx
```

---

## 1. Mengganti Ikon Menu

Cari bagian:

```tsx
const TAB_CONFIG: Record<string, any> = {
  index: {
    icon: Home,
    label: 'Home',
  },

  community: {
    icon: MessageCircleMore,
    label: 'Community',
  },

  learn: {
    icon: BookOpenCheck,
    label: 'Learn',
  },

  profile: {
    icon: User,
    label: 'Profile',
  },

  settings: {
    icon: Settings,
    label: 'Setting',
  },
};
```

### Contoh

Jika ingin mengganti ikon Learn:

```tsx
learn: {
  icon: GraduationCap,
  label: 'Learn',
},
```

Jangan lupa import ikonnya:

```tsx
import {
  GraduationCap,
} from 'lucide-react-native';
```

---

# 2. Mengganti Nama Menu

Masih di bagian:

```tsx
const TAB_CONFIG = {
```

Contoh:

```tsx
community: {
  icon: MessageCircleMore,
  label: 'Community',
},
```

ubah menjadi:

```tsx
community: {
  icon: MessageCircleMore,
  label: 'Komunitas',
},
```

Hasil:

```text
💬
Komunitas
```

---

# 3. Mengubah Ukuran Ikon

Cari bagian:

```tsx
<Icon
  size={20}
```

Angka `20` adalah ukuran ikon.

### Lebih kecil:

```tsx
size={18}
```

### Normal:

```tsx
size={20}
```

### Lebih besar:

```tsx
size={24}
```

Rekomendasi:

```text
18 = kecil
20 = normal
22 = agak besar
24 = besar
```

Untuk navbar 5 menu, gunakan sekitar:

```tsx
size={20}
```

---

# 4. Mengubah Ketebalan Ikon

Cari:

```tsx
strokeWidth={
  isFocused ? 2.6 : 2
}
```

Artinya:

```text
2.6 = ikon aktif
2   = ikon tidak aktif
```

### Lebih tebal:

```tsx
strokeWidth={
  isFocused ? 3 : 2.2
}
```

### Lebih tipis:

```tsx
strokeWidth={
  isFocused ? 2.3 : 1.8
}
```

---

# 5. Membuat Nama Menu di Bawah Ikon

Pastikan pada:

```tsx
tab: {
```

ada:

```tsx
flexDirection: 'column',
```

Contoh:

```tsx
tab: {
  minWidth: 48,
  height: 52,

  paddingHorizontal: 6,

  borderRadius: 17,

  flexDirection: 'column',

  alignItems: 'center',
  justifyContent: 'center',

  gap: 2,
},
```

Hasil:

```text
   🏠
  Home
```

---

# 6. Menampilkan Nama Hanya Saat Aktif

Jika menggunakan:

```tsx
{isFocused && (
  <AppText>
    {label}
  </AppText>
)}
```

maka nama menu hanya muncul pada menu yang sedang aktif.

Contoh:

```text
 🏠      💬      📖      👤      ⚙️
Home
```

---

# 7. Menampilkan Semua Nama Menu

Jika ingin semua nama selalu terlihat, gunakan:

```tsx
<AppText
  color={
    isFocused
      ? colors.light.primary
      : colors.light.onSurfaceVariant
  }
  style={styles.label}
  numberOfLines={1}
>
  {label}
</AppText>
```

Hasil:

```text
 🏠       💬       📖       👤       ⚙️
Home   Community   Learn   Profile  Setting
```

---

# 8. Mengubah Ukuran Tulisan Menu

Cari:

```tsx
activeLabel: {
  fontFamily:
    typography.family.sansBold,

  fontSize: 9.5,

  lineHeight: 13,

  textAlign: 'center',
},
```

Yang paling penting:

```tsx
fontSize: 9.5,
```

### Kecil:

```tsx
fontSize: 9,
```

### Normal:

```tsx
fontSize: 10,
```

### Besar:

```tsx
fontSize: 12,
```

Rekomendasi untuk 5 menu:

```tsx
fontSize: 9.5,
```

atau:

```tsx
fontSize: 10,
```

---

# 9. Mengubah Warna Ikon Aktif

Cari:

```tsx
color={
  isFocused
    ? colors.light.primary
    : colors.light.onSurfaceVariant
}
```

Bagian:

```tsx
colors.light.primary
```

adalah warna ketika menu aktif.

Contoh menggunakan warna langsung:

```tsx
color={
  isFocused
    ? '#58CC02'
    : colors.light.onSurfaceVariant
}
```

---

# 10. Mengubah Warna Ikon Tidak Aktif

Bagian:

```tsx
colors.light.onSurfaceVariant
```

adalah warna ikon ketika tidak aktif.

Contoh:

```tsx
color={
  isFocused
    ? colors.light.primary
    : '#999999'
}
```

---

# 11. Mengubah Warna Background Menu Aktif

Cari:

```tsx
activeTab: {
  backgroundColor:
    colors.light.primaryContainer,
},
```

Bagian:

```tsx
colors.light.primaryContainer
```

adalah warna background menu yang aktif.

Contoh:

```tsx
activeTab: {
  backgroundColor: '#E8F5E9',
},
```

Atau warna hijau:

```tsx
activeTab: {
  backgroundColor: '#DFF7C8',
},
```

---

# 12. Mengubah Bentuk Background Aktif

Cari:

```tsx
borderRadius: 17,
```

Semakin besar angkanya, semakin bulat.

### Tidak terlalu bulat:

```tsx
borderRadius: 10,
```

### Normal:

```tsx
borderRadius: 17,
```

### Sangat bulat:

```tsx
borderRadius: 30,
```

Untuk gaya Duolingo:

```tsx
borderRadius: 17,
```

atau:

```tsx
borderRadius: 20,
```

---

# 13. Mengubah Lebar Background Aktif

Cari:

```tsx
activeTab: {
  backgroundColor:
    colors.light.primaryContainer,

  paddingHorizontal: 11,
}
```

Ubah:

```tsx
paddingHorizontal: 11,
```

### Lebih kecil:

```tsx
paddingHorizontal: 7,
```

### Normal:

```tsx
paddingHorizontal: 10,
```

### Lebih lebar:

```tsx
paddingHorizontal: 15,
```

---

# 14. Mengubah Tinggi Bottom Navbar

Cari:

```tsx
navbar: {
  height: 68,
```

Angka `68` adalah tinggi navbar.

### Lebih tipis:

```tsx
height: 60,
```

### Normal:

```tsx
height: 68,
```

### Lebih tinggi:

```tsx
height: 75,
```

Rekomendasi:

```tsx
height: 68,
```

---

# 15. Mengubah Jarak Navbar dari Bawah Layar

Cari:

```tsx
bottomContainer: {
  position: 'absolute',

  left: 12,
  right: 12,

  bottom:
    Platform.OS === 'ios'
      ? 18
      : 12,
},
```

Bagian:

```tsx
bottom: 12,
```

mengatur jarak navbar dari bawah layar Android.

Contoh lebih dekat ke bawah:

```tsx
bottom: 5,
```

Lebih jauh dari bawah:

```tsx
bottom: 20,
```

---

# 16. Mengubah Jarak Navbar dari Kiri dan Kanan

Cari:

```tsx
left: 12,
right: 12,
```

Lebih lebar:

```tsx
left: 5,
right: 5,
```

Lebih kecil:

```tsx
left: 20,
right: 20,
```

---

# 17. Mengubah Sudut Navbar

Cari:

```tsx
navbar: {
  height: 68,

  ...

  borderRadius: 22,
}
```

Contoh:

```tsx
borderRadius: 15,
```

lebih kotak.

```tsx
borderRadius: 22,
```

normal.

```tsx
borderRadius: 35,
```

sangat bulat.

---

# 18. Mengubah Border Navbar

Cari:

```tsx
borderWidth: 1,
borderColor: '#E5E7EB',
```

### Tanpa border:

```tsx
borderWidth: 0,
```

### Border tipis:

```tsx
borderWidth: 1,
```

### Border lebih tebal:

```tsx
borderWidth: 2,
```

---

# 19. Mengubah Shadow

Cari:

```tsx
elevation: 8,

shadowColor: '#000',

shadowOffset: {
  width: 0,
  height: 4,
},

shadowOpacity: 0.10,

shadowRadius: 10,
```

Kalau ingin shadow lebih kecil:

```tsx
elevation: 4,
shadowOpacity: 0.06,
shadowRadius: 6,
```

Kalau ingin lebih kuat:

```tsx
elevation: 12,
shadowOpacity: 0.15,
shadowRadius: 14,
```

---

# 20. Mengubah Animasi Saat Tombol Ditekan

Cari:

```tsx
Animated.spring(scale, {
  toValue: 0.92,
  useNativeDriver: true,
  speed: 50,
  bounciness: 8,
})
```

Bagian:

```tsx
toValue: 0.92
```

mengatur seberapa kecil tombol ketika ditekan.

Lebih kecil:

```tsx
toValue: 0.85
```

Lebih sedikit mengecil:

```tsx
toValue: 0.96
```

---

# 21. Mengatur Efek Mantul

Cari:

```tsx
bounciness: 12,
```

Semakin besar:

```tsx
bounciness: 18,
```

semakin terasa mantul.

Lebih kalem:

```tsx
bounciness: 5,
```

Rekomendasi:

```tsx
bounciness: 10,
```

---

# 22. Mengubah Urutan Menu

Urutan menu ditentukan oleh:

```tsx
<Tabs.Screen />
```

Cari:

```tsx
<Tabs.Screen name="index" />

<Tabs.Screen name="community" />

<Tabs.Screen name="learn" />

<Tabs.Screen name="profile" />

<Tabs.Screen name="settings" />
```

Urutannya menjadi:

```text
1. Home
2. Community
3. Learn
4. Profile
5. Setting
```

Kalau ingin:

```text
Home
Learn
Community
Profile
Setting
```

ubah menjadi:

```tsx
<Tabs.Screen name="index" />

<Tabs.Screen name="learn" />

<Tabs.Screen name="community" />

<Tabs.Screen name="profile" />

<Tabs.Screen name="settings" />
```

---

# 23. Menambahkan Menu Baru

Misalnya ingin menambahkan menu `Leaderboard`.

### Langkah 1 — Import icon

```tsx
import {
  Trophy,
} from 'lucide-react-native';
```

### Langkah 2 — Tambahkan ke TAB_CONFIG

```tsx
leaderboard: {
  icon: Trophy,
  label: 'Rank',
},
```

### Langkah 3 — Tambahkan Tabs.Screen

```tsx
<Tabs.Screen
  name="leaderboard"
  options={{
    title: 'Rank',
  }}
/>
```

Pastikan file-nya ada:

```text
app/(tabs)/leaderboard.tsx
```

---

# 24. Menyembunyikan Course dari Bottom Navbar

Misalnya ada:

```text
html-course.tsx
css-course.tsx
js-course.tsx
```

Tetapi tidak ingin muncul di navbar.

Tambahkan:

```tsx
<Tabs.Screen
  name="html-course"
  options={{
    href: null,
  }}
/>

<Tabs.Screen
  name="css-course"
  options={{
    href: null,
  }}
/>

<Tabs.Screen
  name="js-course"
  options={{
    href: null,
  }}
/>
```

Selain itu, `CustomTabBar` harus menggunakan filter `TAB_CONFIG` agar route tersebut benar-benar tidak dirender sebagai tombol.

---

# 25. Ringkasan Cepat

| Yang ingin diubah         | Cari kode                       |
| ------------------------- | ------------------------------- |
| Ikon                      | `icon: Home`                    |
| Nama menu                 | `label: 'Home'`                 |
| Ukuran ikon               | `size={20}`                     |
| Ketebalan ikon            | `strokeWidth`                   |
| Warna ikon aktif          | `colors.light.primary`          |
| Warna ikon tidak aktif    | `colors.light.onSurfaceVariant` |
| Ukuran tulisan            | `fontSize: 9.5`                 |
| Posisi nama di bawah ikon | `flexDirection: 'column'`       |
| Background aktif          | `activeTab`                     |
| Warna background aktif    | `primaryContainer`              |
| Bentuk pill aktif         | `borderRadius`                  |
| Lebar pill aktif          | `paddingHorizontal`             |
| Tinggi navbar             | `navbar.height`                 |
| Jarak dari bawah          | `bottom`                        |
| Jarak kiri/kanan          | `left` / `right`                |
| Bentuk navbar             | `navbar.borderRadius`           |
| Border                    | `borderWidth` / `borderColor`   |
| Shadow                    | `elevation` / `shadowOpacity`   |
| Animasi tekan             | `Animated.spring`               |
| Urutan menu               | `<Tabs.Screen>`                 |
| Menyembunyikan route      | `href: null`                    |

---

# REKOMENDASI UKURAN

Untuk navbar dengan 5 menu:

```tsx
navbar: {
  height: 68,
}

tab: {
  height: 52,
}

<Icon
  size={20}
/>

activeLabel: {
  fontSize: 9.5,
}

activeTab: {
  paddingHorizontal: 10,
  borderRadius: 17,
}
```

Jangan langsung memperbesar semua elemen. Kalau navbar terasa terlalu besar, **ubah satu nilai saja terlebih dahulu**, lalu lihat hasilnya di emulator/HP.

---

# STRUKTUR FILE

```text
app/
└── (tabs)/
    ├── _layout.tsx       ← ATURAN BOTTOM NAVBAR
    ├── index.tsx         ← Home
    ├── community.tsx     ← Community
    ├── learn.tsx         ← Learn
    ├── profile.tsx       ← Profile
    ├── settings.tsx      ← Setting
    ├── html-course.tsx   ← Course
    ├── css-course.tsx    ← Course
    └── js-course.tsx     ← Course
```

**Intinya:** hampir semua tampilan Bottom Navbar kamu bisa diubah langsung dari:

```text
app/(tabs)/_layout.tsx
```

Tidak perlu mengubah halaman `index.tsx`, `learn.tsx`, `profile.tsx`, dan halaman lainnya hanya untuk mengubah tampilan navbar.
