# English Speaking A2

Web luyện nói tiếng Anh trình độ A2 - A2+  
Học sinh chọn 1 trong 12 chủ đề, nói bằng micro → AI trả lời + phát âm giọng Mỹ tốc độ chậm.

---

## 🚀 Deploy
1. Fork repo này hoặc clone về.
2. Deploy bằng Vercel:  
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
3. Trong tab **Environment Variables** thêm:
   - `OPENAI_API_KEY = your_openai_api_key`

---

## 🎤 Chức năng
- 12 chủ đề cố định
- Bắt buộc bật micro trước khi luyện
- Nhận diện giọng nói (Speech-to-Text)
- AI trả lời (OpenAI GPT, A2 level)
- Đọc lại câu trả lời bằng giọng Mỹ (chậm vừa, dễ hiểu)
- Có fallback nhập text thủ công nếu không hỗ trợ micro
