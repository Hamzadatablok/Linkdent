import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

// 1. الدالة التي تجلب البيانات (تعمل على السيرفر فقط)
export const loader = async ({ request }) => {
  const url = new URL(request.url);
  // استخراج الـ locationId من الرابط
  const locationId = url.searchParams.get("locationId") || "DEFAULT_ID";

  try {
    const response = await fetch(`https://linkdent.onrender.com/api/contacts/${locationId}`);
    if (!response.ok) throw new Error("فشل جلب البيانات");
    
    const contacts = await response.json();
    return json({ contacts });
  } catch (error) {
    console.error(error);
    return json({ contacts: [] }); // إرجاع مصفوفة فارغة في حالة الخطأ
  }
};

// 2. واجهة العرض (تعمل على المتصفح)
export default function ContactsPage() {
  const { contacts } = useLoaderData();

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>قائمة المرضى في العيادة</h1>
      
      {contacts.length === 0 ? (
        <p>لا يوجد مرضى حالياً أو حدث خطأ في الاتصال.</p>
      ) : (
        <table border="1" style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f4f4f4' }}>
              <th style={{ padding: '10px' }}>الاسم</th>
              <th style={{ padding: '10px' }}>البريد الإلكتروني</th>
              <th style={{ padding: '10px' }}>رقم الهاتف</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact: any) => (
              <tr key={contact.id}>
                <td style={{ padding: '10px' }}>{contact.firstName} {contact.lastName}</td>
                <td style={{ padding: '10px' }}>{contact.email}</td>
                <td style={{ padding: '10px' }}>{contact.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}