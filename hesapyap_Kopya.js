document.addEventListener("DOMContentLoaded", () => {
    
    const vizeInp = document.getElementById("vize");
    const yiliciInp = document.getElementById("yil_ici");
    const finalInp = document.getElementById("final");
    const butunlemeInp = document.getElementById("butunleme");
    
    const devamsizChk = document.getElementById("devamsiz");
    const sinavaGirdiSel = document.getElementById("sinava_girdi");
    
    
    const btnHesapla = document.getElementById("hesapla_btn");
    const btnSifirla = document.getElementById("sifirla_btn");
    
    const sonucAlani = document.getElementById("sonuc_alani");
    const resBasari = document.getElementById("res_basari");
    const resHarf = document.getElementById("res_harf");
    const resDurum = document.getElementById("res_durum");
    const resAciklama = document.getElementById("res_aciklama");

    
    devamsizChk.addEventListener("change", () => {
        if (devamsizChk.checked) {
            sinavaGirdiSel.value = "hayir";
            sinavaGirdiSel.disabled = true;
        } else {
            sinavaGirdiSel.value = "evet";
            sinavaGirdiSel.disabled = false;
        }
    });

    
    butunlemeInp.addEventListener("input", () => {
        if (butunlemeInp.value.trim() !== "") {
            finalInp.style.opacity = "0.4";
        } else {
            finalInp.style.opacity = "1";
        }
    });

    // Hata Gösterme Fonksiyonu
    const showError = (mesaj, element) => {
        sonucAlani.classList.remove("hidden");
        sonucAlani.style.borderColor = "var(--error)";
        resBasari.textContent = "-";
        resHarf.textContent = "-";
        resDurum.textContent = "Hata";
        resDurum.className = "fail";
        resAciklama.innerHTML = `<span style="color:var(--error)">${mesaj}</span>`;
        
        if (element) {
            element.classList.add("input-error");
            setTimeout(() => element.classList.remove("input-error"), 3000);
        }
    };

   
    const showResult = (basari, harf, durumText, isPass, mesaj) => {
        sonucAlani.classList.remove("hidden");
        sonucAlani.style.borderColor = isPass ? "var(--secondary)" : "var(--error)";
        
        resBasari.textContent = basari;
        resHarf.textContent = harf;
        resDurum.textContent = durumText;
        resDurum.className = isPass ? "pass" : "fail";
        resAciklama.innerHTML = mesaj;
    };

    
    const hesapla = () => {
        
        document.querySelectorAll("input").forEach(i => i.classList.remove("input-error"));

       
        if (devamsizChk.checked) {
            showResult("0.00", "F1", "Kaldı", false, "Devamsız (F1) olduğunuz için doğrudan kaldınız. Sınav katsayıları 0 kabul edilir.");
            return;
        }

        
        if (sinavaGirdiSel.value === "hayir") {
            showResult("0.00", "F2", "Kaldı", false, "Devam şartını sağladığınız halde Genel/Bütünleme sınavına girmediğiniz için (F2) kaldınız.");
            return;
        }

        
        const vizeVal = vizeInp.value.trim();
        const yiliciVal = yiliciInp.value.trim();
        const finalVal = finalInp.value.trim();
        const butunlemeVal = butunlemeInp.value.trim();

        
        if (vizeVal === "" || isNaN(vizeVal) || Number(vizeVal) < 0 || Number(vizeVal) > 100) {
            showError("Lütfen 0 ile 100 arasında geçerli bir Vize notu giriniz.", vizeInp);
            return;
        }

        
        let yilIciNotu = Number(vizeVal);
        if (yiliciVal !== "") {
            if (isNaN(yiliciVal) || Number(yiliciVal) < 0 || Number(yiliciVal) > 100) {
                showError("Lütfen 0 ile 100 arasında geçerli bir Yıl İçi Puanı giriniz veya boş bırakınız.", yiliciInp);
                return;
            }
            yilIciNotu = Number(yiliciVal);
        }

        
        let sinavNotu = 0;
        if (butunlemeVal !== "") { // Bütünleme girilmişse
            if (isNaN(butunlemeVal) || Number(butunlemeVal) < 0 || Number(butunlemeVal) > 100) {
                showError("Lütfen 0 ile 100 arasında geçerli bir Bütünleme notu giriniz.", butunlemeInp);
                return;
            }
            sinavNotu = Number(butunlemeVal);
        } else { // Bütünleme boşsa Final zorunlu
            if (finalVal === "" || isNaN(finalVal) || Number(finalVal) < 0 || Number(finalVal) > 100) {
                showError("Bütünleme girmeyecekseniz Final notu zorunludur. Geçerli bir not girin.", finalInp);
                return;
            }
            sinavNotu = Number(finalVal);
        }

        
        const basariNotuNum = (yilIciNotu * 0.40) + (sinavNotu * 0.60);
        const basariNotuStr = basariNotuNum.toFixed(2); // Yüzdelik virgülden sonra 2 hane

        
        if (sinavNotu < 50) {
            showResult(basariNotuStr, "F3", "Kaldı", false, `Genel/Bütünleme sınav notunuz 50'nin altında (<strong>${sinavNotu}</strong>) olduğu için kaldınız.`);
            return;
        }

        if (basariNotuNum < 60) {
            showResult(basariNotuStr, "F3", "Kaldı", false, `Sınav barajını geçtiniz ancak Ders Başarı Notunuz 60'ın altında (<strong>${basariNotuStr}</strong>) kaldığı için kaldınız.`);
            return;
        }

        
        let harf = "";
        if (basariNotuNum >= 90) harf = "A1";
        else if (basariNotuNum >= 80) harf = "A2";
        else if (basariNotuNum >= 70) harf = "B1";
        else if (basariNotuNum >= 65) harf = "B2";
        else if (basariNotuNum >= 60) harf = "C";

        showResult(basariNotuStr, harf, "Geçti", true, "Tebrikler, tüm geçme koşullarını sağlayarak dersi geçtiniz.");
    };

    
    btnHesapla.addEventListener("click", hesapla);

    btnSifirla.addEventListener("click", () => {
        
        vizeInp.value = "";
        yiliciInp.value = "";
        finalInp.value = "";
        butunlemeInp.value = "";
        
        devamsizChk.checked = false;
        sinavaGirdiSel.value = "evet";
        sinavaGirdiSel.disabled = false;
        finalInp.style.opacity = "1";
        
        document.querySelectorAll("input").forEach(i => i.classList.remove("input-error"));
        sonucAlani.classList.add("hidden");
    });

  
    document.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            hesapla();
        }
    });
});