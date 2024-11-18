console.log("denemw")
document.getElementById("connect").addEventListener("click", async () => {
    try {
        const filters = [{ vendorId: 1240, productId: 61395 }];
        // Kullanıcıdan cihaz seçmesini istemek
        const device = await navigator.usb.requestDevice({
            filters:filters // Cihazın vendorId'sini buraya ekleyin
        });

        // Cihazı açmak
        await device.open();
        if (device.configuration === null) {
            await device.selectConfiguration(1); // Gerekirse konfigürasyonu seçin
        }
        await device.claimInterface(0); // Kullanılacak arabirimi seçin

        console.log("Bağlantı kuruldu!");

        // Veri alma döngüsü
        while (true) {
            const result = await device.transferIn(1, 64); // Endpoint ve veri boyutu
            if (result.data) {
                const decoder = new TextDecoder();
                const data = decoder.decode(result.data);
                console.log("Gelen Veri:", data);
                document.getElementById("output").innerText += data + "\n";
            }
        }
    } catch (error) {
        console.error("Hata:", error);
    }
});
