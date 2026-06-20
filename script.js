const AIRTABLE_PAT = "pataLE2syNqac6KUU.de3250ccd56d73105203a93d99b571c5d68f5c9115996abdc5e2892d3cddfe72";
const BASE_ID = "appWRZnpxUuPDTr1S";
const TABLE_NAME = "Aestetic Centre";
const TELEGRAM_TOKEN = "8632368725:AAGK-aFjSXLW5qd14u1f3IObgVuHZU3vwHg";
const CHAT_ID = "-5145887320";

function updatePrice() {
    const procSelect = document.getElementById("procedureSelect");
    const priceDisplayGroup = document.getElementById("priceDisplayGroup");
    const procedurePrice = document.getElementById("procedurePrice");
    const selectedOption = procSelect.options[procSelect.selectedIndex];
    const price = selectedOption.getAttribute("data-price");

    if (price && price !== "0") {
        procedurePrice.innerText = `${price} ₾`;
        priceDisplayGroup.style.display = 'block';
    } else {
        priceDisplayGroup.style.display = 'none';
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const procSelect = document.getElementById("procedureSelect");

    try {
        const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}?view=Grid%20view&_=${new Date().getTime()}`;
        const response = await fetch(url, { headers: { Authorization: `Bearer ${AIRTABLE_PAT}` } });
        const data = await response.json();

        if (data.records) {
            data.records.forEach(record => {
                const key = record.fields.key?.trim();
                const value = record.fields.value;
                
                const option = procSelect.querySelector(`option[data-key="${key}"]`);
                if (option) {
                    option.setAttribute("data-price", value);
                }

                const priceElements = document.querySelectorAll(`[data-key="${key}"]`);
                priceElements.forEach(el => {
                    if (el.classList.contains('price-value')) {
                        el.innerText = `${value} ₾`;
                    }
                });
            });
        }
    } catch (error) { console.error("Airtable Error:", error); }

    const form = document.getElementById("appointmentForm");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const selectedOption = procSelect.options[procSelect.selectedIndex];
        const price = selectedOption.getAttribute("data-price");
        const procedure = selectedOption.text;

        const text = `📩 <b>ახალი ჩანაწერი:</b>
👤 <b>სახელი:</b> ${document.getElementById("clientName").value}
📞 <b>ტელ:</b> ${document.getElementById("clientPhone").value}
📅 <b>დრო:</b> ${document.getElementById("appointmentDate").value}
✨ <b>სერვისი:</b> ${procedure}
💰 <b>ფასი:</b> ${price || "0"} ₾
📝 <b>კომენტარი:</b> ${document.getElementById("clientMessage").value || "არ არის"}`;

        try {
            const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "HTML" })
            });

            if (response.ok) {
                alert("✅ მონაცემები წარმატებით გაიგზავნა!");
                form.reset();
                document.getElementById("priceDisplayGroup").style.display = 'none';
            }
        } catch (err) { alert("შეცდომა!"); }
    });
});

function toggleMenu() {
    const menu = document.getElementById("mobile-menu");
    menu.classList.toggle("open");
    
    console.log("მენიუს სტატუსი:", menu.classList.contains("open") ? "გახსნილია" : "დახურულია");
}
