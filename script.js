const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSPCKRbMdHnupO9JB1erJJLwte88p3cL7Ugmnzi5730hbt0dD9tzRzRZQoFRUa-ynei7jm7U7Jlzefi/pub?output=csv";
const TELEGRAM_TOKEN = "8632368725:AAGK-aFjSXLW5qd14u1f3IObgVuHZU3vwHg";
const CHAT_ID = "6510438875";

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch(CSV_URL);
        const csvText = await response.text();
        const rows = csvText.split('\n').slice(1);
        
        rows.forEach(row => {
            const cols = row.split(',');
            if (cols.length < 2) return;
            const key = cols[0].trim();
            const value = cols[1].trim();
            
            // 1. ფასების განახლება საიტზე (სერვისების ბარათებში)
            document.querySelectorAll(`[data-key="${key}"]`).forEach(el => {
                el.innerText = value;
            });

            // 2. მენიუს სახელების განახლება
            const option = document.querySelector(`option[data-key="${key}"]`);
            if (option) {
                option.text = value;
                option.value = value;
            }

            // 3. ფასების მიბმა მენიუსთვის
            if (key.includes('-price')) {
                const nameKey = key.replace('-price', '-name');
                const targetOption = document.querySelector(`option[data-key="${nameKey}"]`);
                if (targetOption) {
                    targetOption.setAttribute("data-price", value);
                }
            }
        });
    } catch (e) { console.error("შეცდომა მონაცემების ჩატვირთვისას:", e); }

    // ფორმის გაგზავნა
    const form = document.getElementById("appointmentForm");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const procSelect = document.getElementById("procedureSelect");
        const selected = procSelect.options[procSelect.selectedIndex];
        const price = selected.getAttribute("data-price") || "0";
        
        const text = `📩 <b>ახალი ჩანაწერი:</b>\n👤 <b>სახელი:</b> ${document.getElementById("clientName").value}\n📞 <b>ტელ:</b> ${document.getElementById("clientPhone").value}\n📅 <b>დრო:</b> ${document.getElementById("appointmentDate").value}\n✨ <b>სერვისი:</b> ${selected.text}\n💰 <b>ფასი:</b> ${price} ₾`;

        await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "HTML" })
        });
        alert("✅ წარმატებით გაიგზავნა!");
        form.reset();
        document.getElementById("priceDisplayGroup").style.display = 'none';
    });
});

// ფასის ჩვენება მენიუში არჩევისას
function updatePrice() {
    const sel = document.getElementById("procedureSelect");
    const opt = sel.options[sel.selectedIndex];
    const price = opt.getAttribute("data-price");
    const displayGroup = document.getElementById("priceDisplayGroup");
    
    if (price && parseInt(price) > 0) {
        document.getElementById("procedurePrice").innerText = price + " ₾";
        displayGroup.style.display = 'block';
    } else {
        displayGroup.style.display = 'none';
    }
}

function toggleMenu() {
    const menu = document.getElementById("mobile-menu");
    menu.classList.toggle("open");
    
    console.log("მენიუს სტატუსი:", menu.classList.contains("open") ? "გახსნილია" : "დახურულია");
}


function changeSlide(sliderId, direction) {
    const slider = document.getElementById(sliderId);
    const images = slider.querySelectorAll('img');
    let activeIndex = Array.from(images).findIndex(img => img.classList.contains('active'));

    images[activeIndex].classList.remove('active');

    activeIndex = (activeIndex + direction + images.length) % images.length;

    images[activeIndex].classList.add('active');
}
