// إعداد الاتصال بـ Supabase
const supabaseUrl = 'https://duxdtpkxomkjoxnlzjgw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1eGR0cGt4b21ram94bmx6amd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MTYyMzIsImV4cCI6MjA2NzQ5MjIzMn0._MOyOhSQvvKrmEwAJGvibp79JXM9MlTJyEVnpvuTJL0';

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// دالة تحقق الحقول
function validateFields(fields) {
  for (const field of fields) {
    if (!field.value.trim()) {
      alert(`❌ من فضلك أدخل ${field.placeholder}`);
      field.focus();
      return false;
    }
  }
  return true;
}

// تسجيل مستخدم جديد
document.querySelector('.sign-up-container form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = e.target[0];
  const email = e.target[1];
  const password = e.target[2];

  if (!validateFields([username, email, password])) return;

  const { data, error } = await supabase
    .from('users')
    .insert([{
      username: username.value,
      email: email.value,
      password: password.value
    }]);

  if (error) {
    alert('🛑 فشل في التسجيل: ' + error.message);
  } else {
    alert('✅ تم التسجيل بنجاح! يمكنك تسجيل الدخول الآن.');
    e.target.reset();
    document.getElementById("signIn").click(); // تحويل المستخدم إلى واجهة تسجيل الدخول
  }
});

// تسجيل الدخول
document.querySelector('.sign-in-container form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = e.target[0];
  const password = e.target[1];

  if (!validateFields([username, password])) return;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username.value)
    .eq('password', password.value)
    .single();

  if (error || !data) {
    alert('❌ اسم المستخدم أو كلمة المرور غير صحيحة');
  } else {
    // حفظ بيانات المستخدم في localStorage
    localStorage.setItem('currentUser', JSON.stringify({
      id: data.id,
      username: data.username,
      email: data.email
    }));
    alert(`✅ مرحبًا بك ${data.username}`);

    // تحويل المستخدم إلى صفحة dashboard
    window.location.href = "dashboard.html";
  }
});

// التحقق إذا كان المستخدم سجل دخوله مسبقًا
window.addEventListener('DOMContentLoaded', () => {
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    console.log("👋 مرحبًا بك مرة أخرى", JSON.parse(currentUser));
  }
});


const container = document.getElementById('container');
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');

signUpButton.addEventListener('click', () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
  container.classList.remove("right-panel-active");
});
 