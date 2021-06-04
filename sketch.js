let dotNum;
let dotNumSlider;
let angleMult = 1;
let angleMultSlider;
let speed;
let speedSlider;
let following = false;
let followCB;
let showLinesCB;
let showingLines = true;
let radius = 100;
let time = 0;
let followState = 0;

let target = {x: 0, y: 0};

function getDot(n, total, time, mult = 1) {
  const angle = PI / total * n;
  const t = sin(time + angle * mult);
  const ep = {x: cos(angle), y: sin(angle)};
  const pos = {x: ep.x * t, y: ep.y * t};
  return {pos: pos, endPoint: ep}
}

function toggleFollow() {
  following = this.checked();
}

function toggleLines() {
  showingLines = this.checked();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  dotNumSlider = createSlider(0, 8, 3).position(0, 0);
  angleMultSlider = createSlider(1, 127, 1, 2).position(0, 20);
  speedSlider = createSlider(0, 3, 1, 0.1).position(0, 40);
  followCB = createCheckbox('', following).position(0, 60);
  followCB.changed(toggleFollow);
  showingLinesCB = createCheckbox('', showingLines).position(0, 80);
  showingLinesCB.changed(toggleLines);
  
  textAlign(LEFT, CENTER);
}

function draw() {
  dotNum = pow(2, dotNumSlider.value());
  angleMult = angleMultSlider.value();
  speed = speedSlider.value();
  
  dotNumSlider.size(width / 3);
  angleMultSlider.size(width / 3);
  speedSlider .size(width / 3);
  
  const dots = [dotNum];
  
  for(let i = 0; i < dotNum; i++)
    dots[i] = getDot(i, dotNum, time, angleMult);
  
  target = dots[round(dots.length / 5.5)];
  
  background(220);
  
  push();
  
  translate(width / 2, height / 2);
  scale(min(width, height) / radius / 4 * 1.2 * (followState + 1));
  translate(-target.pos.x * radius * followState, -target.pos.y * radius * followState);

  stroke(190);
  strokeWeight(1);
  
  if(showingLines){
    for(let d of dots) {
      const ep = d.endPoint;
      line(ep.x * radius, ep.y  * radius, -ep.x  * radius, -ep.y  * radius);
    }
  }
  
  fill(232, 116, 128, 200);
  stroke(232, 116, 128, 255);
  strokeWeight(1);
  
  for(let d of dots)
    ellipse(d.pos.x * radius, d.pos.y * radius, 8);
  
  if (following) {
    noFill();
    stroke(240, 60, 80, map(followState, 0, 1, 0, 200));
    strokeWeight(1);
    ellipse(target.pos.x * radius, target.pos.y * radius, 12);
  }
  
  pop();
  
  noStroke();
  fill(20, 180);
  text('Number of dots: ' + dotNum, dotNumSlider.x * 2 + dotNumSlider.width + 10, dotNumSlider.y + 10);
  text('Angle Multiplier: ' + angleMult, angleMultSlider.x * 2 + angleMultSlider.width + 10, angleMultSlider.y + 10);
  text('Speed: ' + speed, speedSlider.x * 2 + speedSlider.width + 10, speedSlider.y + 10);
  text('Follow: ' + following, followCB.x * 2 + 25, followCB.y + 10);
  text('Show lines: ' + showingLines, showingLinesCB.x * 2 + 25, showingLinesCB.y + 10);
  
  time += deltaTime / 1000 * speed;
  
  if (following)
    followState += 0.01;
  else
    followState -= 0.01;
  
  followState = min(1, max(0, followState));
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
}
