let fullHTML = document.documentElement;
console.log("hi i am content script")
console.log(fullHTML)
console.log(fullHTML.children)
    let childNodes = fullHTML.childNodes
    console.log(childNodes[1]) // this will be the body always
let img = null
let captcha = null
let textBox = document.querySelector('#AuthenticationFG\\.VERIFICATION_CODE')
console.log(textBox)
let loginBtn = document.querySelector('#VALIDATE_RM_PLUS_CREDENTIALS_CATCHA_DISABLED')
setTimeout(() => {
    img = document.querySelector("#IMAGECAPTCHA");
    console.log(img);
    const base64Data = imageToBase64(img);
    console.log(base64Data)
    solveCaptcha(base64Data).then((res)=>{
            console.log(res)
            captcha = res
            textBox.value = captcha
            // loginBtn.click()
        }
    )
}, 3000);

function imageToBase64(img) {
    const canvas = document.createElement("canvas")
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img,0,0)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // 🔥 Convert to black & white (thresholding)
        for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i+1] + data[i+2]) / 3;

            const val = avg > 140 ? 255 : 0; // tweak threshold (130–160)
            data[i] = data[i+1] = data[i+2] = val;
        }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL("image/png");
}


async function solveCaptcha(base64Data) {
    const formData = new FormData();
    formData.append("apikey", "K86688128888957");
    formData.append("base64Image", base64Data);

    const res = await fetch("https://api.ocr.space/parse/image", {
        method: "POST",
        body: formData
    });

    const data = await res.json();

    console.log(data);
    return data.ParsedResults[0].ParsedText
}

