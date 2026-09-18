# Bot-adkar

بوت Discord مستقل للتذكير بالأذكار وسورة الكهف.

## الميزات
- تحديد روم الإشعارات لكل سيرفر.
- أذكار الصباح يوميًا في وقت قابل للتغيير.
- أذكار المساء يوميًا في وقت قابل للتغيير.
- رابط سورة الكهف كل جمعة في وقت قابل للتغيير.
- إعدادات مستقلة لكل سيرفر.
- حفظ الإعدادات بعد إعادة تشغيل البوت.
- أوامر اختبار للمشرفين.
- المنطقة الزمنية الافتراضية: Africa/Algiers.

## التشغيل

1. ثبّت Node.js.
2. نفّذ:
   npm install
3. أنشئ ملف .env بناءً على .env.example.
4. سجّل الأوامر:
   npm run deploy
5. شغّل البوت:
   npm start

## الأوامر
/set-islamic-channel
/set-morning-time
/set-evening-time
/set-friday-time
/islamic-settings
/islamic-test
/islamic-disable
