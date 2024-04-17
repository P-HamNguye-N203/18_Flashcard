# PTUD_CK
## Installation

```
// Clone Project 
$ git clone https://github.com/P-HamNguye-N203/PTUD_CK.git

// Run code BackEnd api
$ cd BackEnd 
$ pip install -r requirements.txt
$ uvicorn app.main:app --reload

```

## Cấu trúc Project

```
.
├──BackEnd
│   ├──app
│       ├──crud             // chứa các hàm bổ trợ 
│       ├──db               // file cấu hình make DB session
│       ├──main             // file chính chứa api và cấu hình uvicorn
│       ├──models           // Database model      
│       └── schemas         // file định nghĩa cấu trúc dữ liệu từ HTTP requests, database queries và output API
│   └── requirements.txt    // file chứa các thư viện để cài đặt qua pip install
├── FrontEnd
│   └──Flashcard
└── README.md 

```
