 console.log("denemem")// Mevcut sayfanın URL'sini almak için
const pageUrl = encodeURIComponent(window.location.href);
const pageTitle = encodeURIComponent(document.title);

// Facebook'ta paylaşma fonksiyonu


window.shareOnFacebook = function () {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
    window.open(facebookUrl, "_blank",);
};

// Twitter'da paylaşma fonksiyonu
window.shareOnTwitter = function () {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
    window.open(twitterUrl, "_blank",);
};



// LinkedIn paylaşım fonksiyonu
window.shareOnLinkedIn = function () {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
    window.open(linkedinUrl, "_blank",);
};
