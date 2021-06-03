export function Input() {
    document.addEventListener("keydown", function (event) {

      switch(event.code) {
          case "KeyS": {
              let stats = document.querySelectorAll("div[style*='z-index: 1000'] canvas")
              stats.forEach((canvas) => {
                  if(canvas.style.visibility == "hidden") {
                      canvas.style.visibility = "visible"
                  } else {
                      canvas.style.visibility = "hidden"
                  }
              })
          }
      }
    });
}