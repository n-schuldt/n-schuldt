window.onload = function(){
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight + 100;
  var i = 0;
  const description1 = 'a Web Developer';
  const description2 = 'an Engineering Student';
  const description3 = 'a Design Amateur';
  var typeSpeed = 100;
  var desc = description1;
  function typeWriter() {
      if (i < desc.length){
          document.getElementById('description').innerHTML += desc.charAt(i);
          i++;
          setTimeout(typeWriter, typeSpeed);
      };
  };
  window.addEventListener("load", typeWriter());
  
  
  const flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
  console.log('loaded');
  
}

const mouse = {
  x: 0,
  y: 0,
}

window.addEventListener('mousemove', function(e){
  mouse.x = e.x/3;
  mouse.y = e.y/2;
});



class FlowFieldEffect {
  #ctx;
  #width;
  #height;
  #count;
  #radius;
  constructor(ctx, width, height, gradient) {
      this.#ctx = ctx;
      this.#ctx.lineWidth = 0.3;
      this.#width = width;
      this.#height = height;
      this.gradient;
      this.#createGradient();
      this.#ctx.strokeStyle = this.gradient;
      this.#radius = 1.3;
      this.vr = 0.03;
      this.#mapField();
      this.timer = 0;
      this.cellSize = 8;
      this.interval = 1000/60;
      this.timer = 0;
      this.lastTime = 0;
  }
  #createGradient(){
      this.gradient = this.#ctx.createLinearGradient(0, 0,this.#width, this.#height);
      this.gradient.addColorStop("0.1","#0077b6");
      this.gradient.addColorStop("0.2", "#03045e");
      this.gradient.addColorStop("0.4", "#0077b6");
      this.gradient.addColorStop("0.6", "#90e0ef");
      this.gradient.addColorStop("0.8", "#0077b6");
      this.gradient.addColorStop("0.9", "#03045e");
  }
  #mapField(timeStamp){
      let deltaTime = timeStamp - this.lastTime;
      this.lastTime = timeStamp;

      if (this.timer > this.interval){
          this.#ctx.clearRect(0,0,this.#width, this.#height);
          this.#radius += this.vr;
          if (this.#radius > 5  || this.#radius < -5) this.vr *= -1
          for (let y = 0; y < this.#height; y+= this.cellSize){
              for (let x = 0; x < this.#width; x += this.cellSize){
                  const angle = this.#getValue(x, y);
                  this.#draw(angle,x,y);
              }
          }
          this.timer = 0;
      } else {
          this.timer += deltaTime;
      }

      requestAnimationFrame(this.#mapField.bind(this));

  }
  #getValue(x, y){
      return (Math.cos(mouse.y/3 * x * 0.00005) + Math.sin(mouse.x/3 * y * 0.00005)) * this.#radius;
  }
  #draw(angle,x,y){
      let positionX = x;
      let positionY = y*9/10;
      let dx = mouse.x + positionX;
      let dy = mouse.y + positionY;
      let distance = (dx * dx + dy * dy);
      let length = distance > 150000 ? distance : 150000;
      if (length > 900000) length = 900000;
      this.#ctx.beginPath();
      this.#ctx.moveTo(positionX,positionY);
      this.#ctx.lineTo(positionX+Math.sin(angle) * length/10000, positionY+Math.sin(angle) * length/10000);
      
      this.#ctx.stroke();
  }
}
