# PTUD_CK

## Tên ứng dụng

```
- Trang wed có tên là Learn Quickly

- Dự án của bạn sẽ là một trang web FlashCard, cho phép người dùng học các từ vựng, thuật ngữ, hoặc thông tin khác thông qua việc hiển thị chúng theo thẻ flashcard.

- Trang web này sẽ cho phép người dùng không chỉ học từ vựng mà còn có thể mở rộng kiến thức về nhiều lĩnh vực khác nhau như thuật ngữ kỹ thuật, công thức toán học, lịch sử, nghệ thuật, khoa học, và nhiều chủ đề phổ biến khác.

- Trang wed hướng đến đối tượng là học sinh, sinh viên, những người cần học trong thời gian ngắn, cần ghi chú những công thức cần nhớ

- Mỗi flashcard sẽ hiển thị thông tin một cách rõ ràng, dễ hiểu, và thậm chí có hỗ trợ hình ảnh để tăng cường trải nghiệm học tập. Ngoài việc học lý thuyết, người dùng cũng có thể kiểm tra kiến thức của mình thông qua các bài kiểm tra được tích hợp trên trang web.

- Một số sceenshot của ứng dụng

```

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
│       ├──main         // file html trang đăng nhập
│       ├──login        // file html  cho trang login
│       |──signup       // file html  cho trang signup
│       |──main_1       // file html  cho trang chính
│       |──package      // file html  cho trang card
│       |──play         // file html  cho trang học flashcard
│       |──game         // file html  cho trang chơi game
│       ├──css          // chứa các file css
│       ├──js           // chứa các file js
│       └──image        // chứa các file image
└── README.md

```

## THÔNG TIN THÀNH VIÊN

```
- 21071061 - Trần Quang Vinh
- 21074741 - Hoàng Ngọc Tân
- 21104551 - Phạm Chí Nguyên
- 21023751 - Nguyễn Thanh Hoài

```

## TRÁCH NHIỆM

```
- Trần Quang Vinh:
    - Code Frontend
    - Thiết kế figma

- Hoàng Ngọc Tân:
    - Code Frontend
    - Thiết kế figma

- Phạm Chí Nguyên:
    - Code Backend
    - Thiết kế database

- Nguyễn Thanh Hoài:
    - Code Backend
    - Làm Powerpoint
    - Viết báo cáo

```
