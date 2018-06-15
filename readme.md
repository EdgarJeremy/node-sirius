# Sirius.js
***
Sirius.js - Framework node.js untuk service backend, RESTful API, Websocket Server untuk komunikasi real-time dan server GraphQL

## Prasyarat
***
Untuk menggunakan framework ini, pertimbangkan kita sudah menginstall dan mengetahui hal-hal berikut
- [NodeJS](https://nodejs.org/en/) terinstall
- [NPM](https://nodejs.org/en/) terinstall
- Pengetahuan tentang NodeJS (Objects, Modules), ECMAScript 6, Babel, Sequelize ORM
- Pengetahuan tentang ECMAScript 6
- Pengetahuan dasar Babel compiler
- Pengetahuan tentang Object Relational Mapping ([Sequelize](http://docs.sequelizejs.com/))
- Konsep migration & seed

## Memulai
***
#### Mendapatkan package Sirius.js
Jika prasyarat sudah terpenuhi, maka anda sudah bisa mulai menggunakan Sirius.js.
Download release Sirius.js [disini](https://github.com/EdgarJeremy/sirius.js/releases) atau clone langsung dari git repository

```bash
$ git clone https://github.com/edgarjeremy/sirius.js
```
#### Menginstall Sirius.js
Jika kopian Sirius.js sudah berada di mesin anda, selanjutnya jalankan perintah ini untuk menginstall module dasar yang dibutuhkan dalam internal framework.

```bash
$ npm install 
```

## Konfigurasi
***
Semua konfigurasi framework Sirius.js terdefinisikan sebagai object pada file `./config.json` (Selengkapnya di bagian dokumentasi).
#### Server
Konfigurasi server berhubungan dengan bagaimana Sirius.js menjalankan servicenya sebagai server yang akan melayani request dari client. Konfigurasi ini terdapat di bagian `server` dan terdiri dari beberapa field :
- Protocol (Protokol apa yang digunakan Sirius.js untuk berjalan => `'http'`|`'https'`)
- Port (Port tempat Sirius.js untuk mendengarkan request)

#### Request
Konfigurasi ini berfungsi mengatur bagaimana request masuk ke infrastruktur Sirius.js. Konfigurasi ini terdapat di bagian `request` dan terdiri dari beberapa field :
- Limit (Seberapa besar batas pengiriman paket dari client ke server)

#### Session
Konfigurasi ini mengatur session dalam server. Konfigurasi ini terdapat di bagian `session` dan terdiri dari beberapa field :
- Secret (String rahasia yang akan dipakai sebagai kunci untuk enkripsi session)
- MaxAge (Total waktu maksimum suatu session disimpan di server dalam milidetik)

#### Folders
Konfigurasi ini mengatur folder tempat file-file core berada. Konfigurasi ini terdapat di bagian `folders` dan terdiri dari beberapa field :
- Routes (Folder route)
- Models (Folder model)

#### Database
Konfigurasi database berhubungan dengan bagaimana Sirius.js berkomunikasi dengan server database. Konfigurasi ini terdapat di bagian `database` dan terdiri dari beberapa field :
- Host (Hostname/Domain/IP tempat server database berjalan)
- User (Username untuk otentikasi database)
- Password (Password untuk otentikasi database)
- Database (Nama database default untuk koneksi yang berjalan)
- Port (Port tempat berjalannya service database ke host yang sudah ditentukan)
- Dialect (Engine/Driver database => `'mysql'`|`'sqlite'`|`'postgres'`|`'mssql'`)

#### Encryption
Konfigurasi ini mengatur bagaimana enkripsi berjalan. Konfigurasi ini terdapat di bagian `encryption` dan terdiri dari beberapa field :
- Salt Rounds (Salt yang dipakai untuk enkripsi ([baca](https://stackoverflow.com/questions/46693430/what-are-salt-rounds-and-how-are-salts-stored-in-bcrypt?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa)))

#### Migration
Konfigurasi yang mengatur migrasi database dan sinkronisasi model. Terdapat di bagian `migration` dan terdiri dari beberapa field :
- Watch (Boolean apakah perubahan field model langsung di terapkan di database setiap server berjalan/restart)
- Renew (Boolean apakah semua definisi tabel di-drop dan di buat baru di database setiap server berjalan/restart)

#### Environment
Konfigurasi tentang lingkungan aplikasi. Terdapat di bagian `environment` dan bernilai `development` (untuk server dalam masa pengembangan) dan `production` (untuk server siap pakai)

#### CORS
Konfigurasi ini mengatur pre-flight request dan origin tempat dia berasal. Terdapat di bagian `cors` dan dapat bernilai suatu string nama domain/ip address, asterisk `*` (artinya semua domain disetujui) atau array yang berisi string domain/ip address yang diizinkan.