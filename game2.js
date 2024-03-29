/*
------------------------------------------------------Changelog------------------------------------------------------
27/02/2024
 • imported AIcode project

28/02/2024 13:15
 • finishd toilet model

---------------------------------------------------------------------------------------------------------------------
*/

// The support functions that might not be necessary
function isin(a, b) { // check is a in b
    for (var i = 0; i < b.length; i += 1) {
        if (a == b[i]) {
            return true;
        }
    }
    return false;
};

function randchoice(list, remove = false) { // chose 1 from a list and update list
    let length = list.length;
    let choice = randint(0, length-1);
    if (remove) {
        let chosen = list.splice(choice, 1);
        return [chosen, list];
    }
    return list[choice];
};

function randint(min, max, notequalto=false) { // Randint returns random interger between min and max (both included)
    if (max - min <= 1) {
        return min;
    }
    var gen = Math.floor(Math.random() * (max - min + 1)) + min;
    var i = 0; // 
    while (gen != min && gen != max && notequalto && i < 100) { // loop max 100 times
        gen = Math.floor(Math.random() * (max - min + 1)) + min;
        i += 1;
        console.log('calculating...');
    }
    if (i >= 100) {
        console.log('ERROR: could not generate suitable number');
    }
    return gen;
};

function replacehtml(text) {
    document.getElementById("game").innerHTML = text;
};

function addImage(img, x, y, cx, cy, scale, r, absolute, opacity=1) {
    var c = document.getElementById('main');
    var ctx = c.getContext("2d");
    ctx.globalAlpha = opacity;
    if (absolute) {
        ctx.setTransform(scale, 0, 0, scale, x, y); // sets scale and origin
        ctx.rotate(r);
        ctx.drawImage(img, -cx, -cy);
    } else {
        ctx.setTransform(scale, 0, 0, scale, x-player.x+display.x/2, y-player.y+display.y/2); // position relative to player
        ctx.rotate(r);
        ctx.drawImage(img, -cx, -cy);
    }
    ctx.globalAlpha = 1.0;
};

function clearCanvas(canvas) {
    var c = document.getElementById(canvas);
    var ctx = c.getContext("2d");
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, display.x, display.y);
    ctx.restore();
};

function drawLine(pos, r, length, style, absolute) {
    var c = document.getElementById("main");
    var ctx = c.getContext("2d");
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (style) {
        ctx.strokeStyle = style.colour;
        ctx.lineWidth = style.width*data.constants.zoom;
        ctx.globalAlpha = style.opacity;
    }
    ctx.beginPath();
    if (absolute) {
        ctx.moveTo(pos.x*data.constants.zoom, pos.y*data.constants.zoom);
        ctx.lineTo((pos.x + length * Math.cos(r))*data.constants.zoom, (pos.y + length * Math.sin(r))*data.constants.zoom);
    } else {
        ctx.moveTo((pos.x-player.x)*data.constants.zoom+display.x/2, (pos.y-player.y)*data.constants.zoom+display.y/2);
        ctx.lineTo((pos.x-player.x + length * Math.cos(r))*data.constants.zoom+display.x/2, (pos.y-player.y + length * Math.sin(r))*data.constants.zoom+display.y/2);
    }
    ctx.stroke();
    ctx.restore();
};

function renderLine(pos, r, length, style) {
    let ns = undefined;
    switch (style) {
        case 'red':
            ns = data.red;
            break;
        case 'green':
            ns = data.green;
            break;
        case 'blue':
            ns = data.blue;
            break;
        case 'black':
            ns = data.black;
            break;
        case 'white':
        default:
            ns = data.white;
            break;
    }
    drawLine(pos, r-Math.PI/2, length, ns, false);
};

function getDist(sPos, tPos) { 
    // Mathematics METHods
    var dx = tPos.x - sPos.x;
    var dy = tPos.y - sPos.y;
    var dist = Math.sqrt(dx*dx+dy*dy);
    return dist;
};

function correctAngle(a) {
    a = a%(Math.PI*2);
    return a;
};

function adjustAngle(a) {
    if (a > Math.PI) {
        a -= 2*Math.PI;
    }
    return a;
};

function rotateAngle(r, rTarget, increment) {
    console.log(r);
    if (isNaN(r)) {
        throw "FUCK";
    }
    if (Math.abs(r) > Math.PI*4 || Math.abs(rTarget) > Math.PI*4) {
        throw "Error: You f*cked up the angle thing again...";
        console.log(r, rTarget);
        r = correctAngle(r);
        rTarget = correctAngle(rTarget);
    }
    if (r == rTarget) {
        return correctAngle(r);
    } else if (rTarget - r <= Math.PI) {
        if (rTarget - r < increment) {
            r = rTarget;
        } else {
            r += increment;
        }
        return correctAngle(r);
    } else if (r - rTarget <= Math.PI) {
        if (rTarget - r < increment) {
            r = rTarget;
        } else {
            r += increment;
        }
        return correctAngle(r);
    } else {
        console.log(r, rTarget, increment);
        throw "idk wtf went wrong";
    }
};

function aim(initial, final) {
    if (initial == final) { 
        return 0;
    }
    let diff = {x: final.x - initial.x, y: initial.y - final.y};
    if (diff.x == 0) {
        if (diff.y > 0) {
            return 0;
        } else {
            return Math.PI;
        }
    } else if (diff.y == 0) {
        if (diff.x > 0) {
            return Math.PI/2;
        } else {
            return 3*Math.PI/2;
        }
    }
    let angle = Math.atan(Math.abs(diff.y / diff.x));
    if (diff.x > 0 && diff.y > 0) {
        return Math.PI/2 - angle;
    } else if (diff.x > 0 && diff.y < 0) {
        return Math.PI/2 + angle;
    } else if (diff.x < 0 && diff.y < 0) {
        return 3*Math.PI/2 - angle;
    } else {
        return 3*Math.PI/2 + angle;
    }
};

function offsetPoints(points, offset) {
    for (let i = 0; i < points.length; i++){
        points[i].x += offset.x;
        points[i].y += offset.y;
    }
    return points;
};

function roman(number) {
    if (number <= 0 || number >= 4000) {
        var symbols = ['0','1','2','3','4','5','6','7','8','9','¡','£','¢','∞','§','¶','œ','ß','∂','∫','∆','√','µ','†','¥','ø'];
        return `${randchoice(symbols)}${randchoice(symbols)}${randchoice(symbols)}`;
    }
    
    const romanNumerals = {
        M: 1000,
        CM: 900,
        D: 500,
        CD: 400,
        C: 100,
        XC: 90,
        L: 50,
        XL: 40,
        X: 10,
        IX: 9,
        V: 5,
        IV: 4,
        I: 1
    };
    
    let romanNumeral = '';
    
    for (let key in romanNumerals) {
        while (number >= romanNumerals[key]) {
            romanNumeral += key;
            number -= romanNumerals[key];
        }
    }
    return romanNumeral;
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

function toColour(colour) {
    return `rgba(${colour.r}, ${colour.g}, ${colour.b}, ${colour.a})`;
};

function drawCircle(x, y, radius, fill, stroke, strokeWidth, opacity, absolute) { // draw a circle
    var canvas = document.getElementById('main');
    var ctx = canvas.getContext("2d");
    ctx.resetTransform();
    ctx.beginPath();
    ctx.globalAlpha = opacity;
    if (absolute) {
        ctx.arc(x*data.constants.zoom, y*data.constants.zoom, radius*data.constants.zoom, 0, 2 * Math.PI, false);
    } else {
        ctx.arc((-player.x+x)*data.constants.zoom+display.x/2, (-player.y+y)*data.constants.zoom+display.y/2, radius*data.constants.zoom, 0, 2 * Math.PI, false);
    }
    if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
    }
    if (stroke) {
        ctx.lineWidth = strokeWidth*data.constants.zoom;
        ctx.strokeStyle = stroke;
        ctx.stroke();
    }
    ctx.globalAlpha = 1.0;
};

function displaytxt(txt, pos) {
    var canvas = document.getElementById("canvasOverlay");
    var ctx = canvas.getContext("2d");
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    // Set the font and text color
    ctx.font = "20px Verdana";
    ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
    // Display the points on the canvas
    ctx.fillText(txt, pos.x*data.constants.zoom, pos.y*data.constants.zoom);
    ctx.stroke();
    ctx.restore();
};

function rotatePolygon(point, r) {
    let points = JSON.parse(JSON.stringify(point));
    for (let i = 0; i < points.length; i++) {
        points[i].x = point[i].x * Math.cos(r) - point[i].y * Math.sin(r); 
        points[i].y = point[i].x * Math.sin(r) + point[i].y * Math.cos(r); 
    }
    return points
};

function drawPolygon(point, offset, r, fill, stroke, absolute, debug=false) {
    let points = JSON.parse(JSON.stringify(point));
    //console.log(points);
    if (points.length < 3) {
        throw "Error: Your polygon needs to have at least 3 points dumbass";
    }
    points = rotatePolygon(points, r)
    var canvas = document.getElementById('main');
    var ctx = canvas.getContext("2d");
    ctx.resetTransform();
    ctx.beginPath();
    if (absolute) {
        ctx.moveTo((points[0].x + offset.x)*data.constants.zoom, (points[0].y + offset.y)*data.constants.zoom);
        if (debug) {displaytxt(`(${Math.round((points[0].x + offset.x)*data.constants.zoom)}, ${Math.round((points[0].y + offset.y)*data.constants.zoom)})`, {x: (points[0].x + offset.x)*data.constants.zoom, y: (points[0].y + offset.y)*data.constants.zoom});}
    } else {
        ctx.moveTo((points[0].x-player.x + offset.x)*data.constants.zoom+display.x/2, (points[0].y-player.y + offset.y)*data.constants.zoom+display.y/2);
        if (debug) {displaytxt(`(${Math.round((points[0].x-player.x + offset.x)*data.constants.zoom+display.x/2)}, ${Math.round((points[0].y-player.y + offset.y)*data.constants.zoom+display.y/2)})`, {x: (points[0].x-player.x + offset.x)*data.constants.zoom+display.x/2, y: (points[0].y-player.y + offset.y)*data.constants.zoom+display.y/2});}
        //if (debug) {displaytxt(`(${Math.round(points[0].x-player.x+display.x/2 + offset.x)}, ${Math.round(points[0].y-player.y+display.y/2 + offset.y)})`, {x: points[0].x-player.x+display.x/2 + offset.x, y: points[0].y-player.y+display.y/2 + offset.y});}
    }
    for (let i = 1; i < points.length; i++) {
        if (absolute) {
            ctx.lineTo((points[i].x + offset.x)*data.constants.zoom, (points[i].y + offset.y)*data.constants.zoom);
            if (debug) {displaytxt(`(${Math.round((points[i].x + offset.x)*data.constants.zoom)}, ${Math.round((points[i].y + offset.y)*data.constants.zoom)})`, {x: (points[i].x + offset.x)*data.constants.zoom, y: (points[i].y + offset.y)*data.constants.zoom});}
        } else {
            ctx.lineTo((points[i].x-player.x + offset.x)*data.constants.zoom+display.x/2, (points[i].y-player.y + offset.y)*data.constants.zoom+display.y/2);
            if (debug) {displaytxt(`(${Math.round((points[i].x-player.x + offset.x)*data.constants.zoom+display.x/2)}, ${Math.round((points[i].y-player.y + offset.y)*data.constants.zoom+display.y/2)})`, {x: (points[i].x-player.x + offset.x)*data.constants.zoom+display.x/2, y: (points[i].y-player.y + offset.y)*data.constants.zoom+display.y/2});}
            //if (debug) {displaytxt(`(${Math.round(points[i].x-player.x+display.x/2 + offset.x)}, ${Math.round(points[i].y-player.y+display.y/2 + offset.y)})`, {x: points[i].x-player.x+display.x/2 + offset.x, y: points[i].y-player.y+display.y/2 + offset.y});}
        }
    }
    ctx.closePath();
    if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
    }
    if (stroke) {
        ctx.lineWidth = stroke.width*data.constants.zoom;
        ctx.strokeStyle = stroke.colour;
        ctx.stroke();
    }
};

function drawLight(x, y, radius) {
    var canvas = document.getElementById('main');
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    if (false) {
        ctx.arc(x*data.constants.zoom, y*data.constants.zoom, radius*data.constants.zoom, 0, 2 * Math.PI, false);
    } else {
        ctx.arc((player.x+x)*data.constants.zoom+display.x/2, (player.y+y)*data.constants.zoom+display.y/2, radius*data.constants.zoom, 0, 2 * Math.PI, false);
    }
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;

    ctx.fill();
};

function grid(spacing, reference) { // TODO: update colours
    for (let i = 0; i >= reference.x - (display.x/2 + spacing*5)/data.constants.zoom; i -= spacing) {
        drawLine({x: i, y: reference.y + (display.y/2 + spacing)/data.constants.zoom}, 3*Math.PI/2, (display.y + spacing*2)/data.constants.zoom, {colour:'#000000',width:10,opacity:0.05}, false);
    }
    for (let i = 0; i <= reference.x + (display.x/2 + spacing*5)/data.constants.zoom; i += spacing) {
        drawLine({x: i, y: reference.y + (display.y/2 + spacing)/data.constants.zoom}, 3*Math.PI/2, (display.y + spacing*2)/data.constants.zoom, {colour:'#000000',width:10,opacity:0.05}, false);
    }
    for (let i = 0; i >= reference.y - (display.y/2 + spacing*5)/data.constants.zoom; i -= spacing) {
        drawLine({x: reference.x + (display.x/2 + spacing)/data.constants.zoom, y: i}, Math.PI, (display.x + spacing*2)/data.constants.zoom, {colour:'#000000',width:10,opacity:0.05}, false);
    }
    for (let i = 0; i <= reference.y + (display.y/2 + spacing*5)/data.constants.zoom; i += spacing) {
        drawLine({x: reference.x + (display.x/2 + spacing)/data.constants.zoom, y: i}, Math.PI, (display.x + spacing*2)/data.constants.zoom, {colour:'#000000',width:10,opacity:0.05}, false);
    }
};

function renderExplosion(explosion) {
    drawCircle(explosion.x-explosion.r, explosion.y-explosion.r, explosion.r, '#fccbb1', '#f7b28d', 0.1, 0.2*explosion.transparancy, false);
    drawCircle(explosion.x-explosion.r, explosion.y-explosion.r, explosion.r, false, '#f7b28d', 5, 0.2);
    drawCircle(explosion.x-explosion.r, explosion.y-explosion.r, Math.max(explosion.r-20, 0), false, '#fcd8d2', 20, 0.1*explosion.transparancy, false);
    drawCircle(explosion.x-explosion.r, explosion.y-explosion.r, Math.max(explosion.r-15, 0), false, '#fcd8d2', 15, 0.1*explosion.transparancy, false);
    drawCircle(explosion.x-explosion.r, explosion.y-explosion.r, Math.max(explosion.r-10, 0), false, '#fcd8d2', 10, 0.1*explosion.transparancy, false);
    drawCircle(explosion.x-explosion.r, explosion.y-explosion.r, Math.max(explosion.r-5, 0), false, '#fcd8d2', 5, 0.1*explosion.transparancy, false);
    drawLight(explosion.x-explosion.r, explosion.y-explosion.r, explosion.r*1.1);
};

function handleExplosion(explosion) {
    //console.log(explosion);
    if (explosion.r >= explosion.maxR) {
        explosion.transparancy *= 0.75;
        explosion.r *= 1.2;
        explosion.active = false;
    }
    if (explosion.r < explosion.maxR) {
        explosion.active = true;
        explosion.r += explosion.expandSpeed;
        if (explosion.r > explosion.maxR) {
            explosion.r = explosion.maxR;
        }
    }
    if (explosion.transparancy > 0.25) {
        return explosion;
    } return false;
};

function normalDistribution(mean, sDiv) {
    let u = 0;
    let v = 0;
    while (u === 0) u = Math.random(); 
    while (v === 0) v = Math.random(); 
    let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    return mean + z * sDiv;
};

function raySegmentIntersection(pointIn, segmentIn) {
    let point = vMath(pointIn, 1.1, 'multiply');
    let segment = {start: vMath(segmentIn.start, 1.1, 'multiply'), end: vMath(segmentIn.end, 1.1, 'multiply')};
    let A1 = adjustAngle(correctAngle(aim(point, segment.start)));
    let A2 = adjustAngle(correctAngle(aim(point, segment.end)));
    if ((A1 >= 0 && A2 <= 0 || A2 >= 0 && A1 <= 0) && Math.abs(A1) + Math.abs(A2) < Math.PI) {
        return true;
    }
    return false;
};

function pointInPolygon(point, polygon) {
    let inside = false;
    let cnt = 0;
    if (raySegmentIntersection(point, {start: polygon[0], end: polygon[polygon.length-1]})) {
        inside = !inside;
        cnt++;
    }
    for (let i = 0; i < polygon.length-1; i++) {
        if (raySegmentIntersection(point, {start: polygon[i], end: polygon[i+1]})) {
            inside = !inside;
            cnt++;
        }
    }
    return inside;
};

function vMath(v1, v2, mode) { 
    switch (mode) {
        case '||':
        case 'magnitude':
            return Math.sqrt(v1.x**2+v1.y**2);
        case '+': 
        case 'addition':
        case 'add':
            return {x: v1.x+v2.x, y: v1.y+v2.y};
        case '-': 
        case 'subtraction':
        case 'subtract':
            return {x: v1.x-v2.x, y: v1.y-v2.y};
        case '*': 
        case 'x': 
        case 'scalar multiplication':
        case 'multiplication':
        case 'multiply': // v2 is now a scalar
            return {x: v1.x*v2, y: v1.y*v2};
        case '/': 
        case 'division':
        case 'divide': // v2 is now a scalar
            return {x: v1.x/v2, y: v1.y/v2};
        case '•': 
        case '.': 
        case 'dot product': 
            return v1.x * v2.x + v1.y * v2.y;
        case 'cross product': // chat gpt, I believe in you (I doubt this is correct)
            return v1.x * v2.y - v1.y * v2.x;
        case 'projection':
        case 'vector resolute':
        return vMath(v2, vMath(v1, v2, '.')/vMath(v2, null, '||')**2, 'x');
        default:
            throw 'what are you trying to do to to that poor vector?';
    }
};

function toComponent(m, r) {
    return {x: m * Math.sin(r), y: -m * Math.cos(r)};
};

function toPol(i, j) {
    return {m: Math.sqrt(i**2+j**2), r: aim({x: 0, y: 0}, {x: i, y: j})};
};

function circleToPolygon(pos, r, sides) {
    let step = Math.PI*2/sides;
    let polygon = [];
    for(let i = 0; i < sides; i++) {
        polygon.push(vMath(toComponent(r, step*i),pos,'add'));
    }
    return polygon;
};

function pressKey(key) {
    orders.push({id: key, value: true});
}

function releaseKey(key) {
    orders.push({id: key, value: false});
}

const noAI = `
let orders = [];
return orders;
`;

const basicTurretAI = `
let orders = [];
let target = entities[0];
orders.push({id: 'aim', value: {x: target.x, y: target.y}});
orders.push({id: 'click', value: true});
return orders;
`;

const basicTankAI = `
let orders = [];
let target = entities[0];
orders.push({id: 'aim', value: {x: target.x, y: target.y}});
orders.push({id: 'click', value: true});
let nr = adjustAngle(correctAngle(aim(unit, target)-unit.r));
if (Math.abs(nr) > Math.PI/48) {
    if (nr > 0) {
        orders.push({id: 'd', value: true});
        orders.push({id: 'a', value: false});
    } else {
        orders.push({id: 'a', value: true});
        orders.push({id: 'd', value: false});
    }
}
let dist = getDist(unit, target);
if (Math.abs(nr) < Math.PI/6 && dist > 750) {
    orders.push({id: 'w', value: true});
    orders.push({id: 's', value: false});
}
if (dist < 500) {
    orders.push({id: 's', value: true});
    orders.push({id: 'w', value: false});
}
return orders;
`;

const basicMovingTargetAI = `
let orders = [];
let target = entities[0];
if (unit.x > 1500) {
    orders.push({id: 'a', value: true});
    orders.push({id: 'd', value: false});
} else if (unit.x < -1500) {
    orders.push({id: 'a', value: false});
    orders.push({id: 'd', value: true});
}
return orders;
`;

const betterTurretAI = `
let orders = [];
let target = undefined;
for (let i = 0; i < entities.length; i++) {
    if (entities[i].team != unit.team) {
        if (target == undefined || getDist(unit, entities[i]) < getDist(unit, target)) {
            target = entities[i];
        }
    }
}
if (target) {
    orders.push({id: 'aim', value: {x: target.x, y: target.y}});
    orders.push({id: 'click', value: true});
} else {
    orders.push({id: 'aim', value: {x: unit.x, y: unit.y}});
    orders.push({id: 'click', value: false});
}
return orders;
`;

const shieldAI = `
let orders = [];
let target = undefined;
for (let i = 0; i < entities.length; i++) {
    if (entities[i].team != unit.team) {
        if (target == undefined || getDist(unit, entities[i]) < getDist(unit, target)) {
            target = entities[i];
        }
    }
}
if (target) {
    let caim = toPol(target.x-unit.x, target.y-unit.y);
    caim.r -= Math.PI/2;
    let naim = vMath(toComponent(caim.m, caim.r), unit, '+');
    orders.push({id: 'aim', value: naim});
} else {
    orders.push({id: 'aim', value: {x: unit.x, y: unit.y}});
}

return orders;
`;

// Aim assist program
const advancedTurretAI = `
let orders = [];
let target = undefined;
for (let i = 0; i < entities.length; i++) {
    if (entities[i].team != unit.team) {
        if (target == undefined || getDist(unit, entities[i]) < getDist(unit, target)) {
            target = entities[i];
        }
    }
}
if (target) {
    let dist = getDist(unit, target);
    const bulletVelocity=30;
    let time = dist/bulletVelocity;
    let enemymotionx = time*target.vx;
    let enemymotiony = time*target.vy;
    let playermotionx = unit.v*Math.cos(unit.r);
    let playermotiony = unit.v*Math.sin(unit.r);
    drawLine(unit, aim(unit, {x: target.x+enemymotionx+playermotionx, y: target.y+enemymotiony+playermotiony})-Math.PI/2, 5000, data.red.stroke, false);
    orders.push({id: 'aim', value: {x: target.x+enemymotionx+playermotionx, y: target.y+enemymotiony+playermotiony}});
    if (dist < 3500) {
        orders.push({id: 'click', value: true});
    } else {
        orders.push({id: 'click', value: false});
    }
} else {
    orders.push({id: 'aim', value: {x: unit.x, y: unit.y}});
    orders.push({id: 'click', value: false});
}
return orders;
`;

const sniperTurretAI = `
let orders = [];
let target = undefined;
for (let i = 0; i < entities.length; i++) {
    if (entities[i].team != unit.team) {
        if (target == undefined || getDist(unit, entities[i]) < getDist(unit, target)) {
            target = entities[i];
        }
    }
}
if (target) {
    let dist = getDist(unit, target);
    const bulletVelocity=50;
    let time = dist/bulletVelocity;
    let enemymotionx = time*target.vx;
    let enemymotiony = time*target.vy;
    let playermotionx = unit.v*Math.cos(unit.r);
    let playermotiony = unit.v*Math.sin(unit.r);
    drawLine(unit, aim(unit, {x: target.x+enemymotionx+playermotionx, y: target.y+enemymotiony+playermotiony})-Math.PI/2, 5000, data.red.stroke, false);
    orders.push({id: 'aim', value: {x: target.x+enemymotionx+playermotionx, y: target.y+enemymotiony+playermotiony}});
    if (dist < 3500) {
        orders.push({id: 'click', value: true});
    } else {
        orders.push({id: 'click', value: false});
    }
} else {
    orders.push({id: 'aim', value: {x: unit.x, y: unit.y}});
    orders.push({id: 'click', value: false});
}
console.log(orders);
return orders;
`;

const aimAssistAI = `
let orders = [];
let target = undefined;
for (let i = 0; i < entities.length; i++) {
    if (entities[i].team != unit.team) {
        if (target == undefined || getDist(unit, entities[i]) < getDist(unit, target)) {
            target = entities[i];
        }
    }
}
if (target) {
    let dist = getDist(unit, target);
    const bulletVelocity=10;
    let time = dist/bulletVelocity;
    let enemymotionx = time*target.vx;
    let enemymotiony = time*target.vy;
    let playermotionx = unit.v*Math.cos(unit.r);
    let playermotiony = unit.v*Math.sin(unit.r);
    drawLine(unit, aim(unit, {x: target.x+enemymotionx+playermotionx, y: target.y+enemymotiony+playermotiony})-Math.PI/2, 5000, data.green.stroke, false);
    orders.push({id: 'aim', value: {x: target.x+enemymotionx+playermotionx, y: target.y+enemymotiony+playermotiony}});
    if (dist < 5000) {
        orders.push({id: 'click', value: true});
    } else {
        orders.push({id: 'click', value: false});
    }
} else {
    orders.push({id: 'aim', value: {x: unit.x, y: unit.y}});
    orders.push({id: 'click', value: false});
}
return orders;
`;

const leftArmAssistAI = `
let orders = [];
let target = undefined;
for (let i = 0; i < entities.length; i++) {
    if (entities[i].team != unit.team) {
        if (target == undefined || getDist(unit, entities[i]) < getDist(unit, target)) {
            target = entities[i];
        }
    }
}
if (target) {
    let dist = getDist(unit, target);
    const bulletVelocity=30;
    let offset = toPol(-100, 0);
    offset.r += aim(unit, {x: target.x, y: target.y});
    offset = toComponent(offset.m, offset.r);
    let newpos = vMath(unit, offset, '+');
    let time = dist/bulletVelocity;
    let enemymotionx = time*target.vx;
    let enemymotiony = time*target.vy;
    let playermotionx = unit.v*Math.cos(unit.r);
    let playermotiony = unit.v*Math.sin(unit.r);
    let aimr = aim(newpos, {x: target.x+enemymotionx+playermotionx, y: target.y+enemymotiony+playermotiony});
    renderLine(unit, aimr, 5000, 'green');
    orders.push({id: 'aim', value: vMath(unit, toComponent(dist, aimr), '+')});
    if (dist < 5000) {
        orders.push({id: 'click', value: true});
    } else {
        orders.push({id: 'click', value: false});
    }
} else {
    orders.push({id: 'aim', value: {x: unit.x, y: unit.y}});
    orders.push({id: 'click', value: false});
}
return orders;
`;

const rightArmAssistAI = `
let orders = [];
let target = undefined;
for (let i = 0; i < entities.length; i++) {
    if (entities[i].team != unit.team) {
        if (target == undefined || getDist(unit, entities[i]) < getDist(unit, target)) {
            target = entities[i];
        }
    }
}
if (target) {
    let dist = getDist(unit, target);
    const bulletVelocity=30;
    let offset = toPol(100, 0);
    offset.r += aim(unit, {x: target.x, y: target.y});
    offset = toComponent(offset.m, offset.r);
    let newpos = vMath(unit, offset, '+');
    let time = dist/bulletVelocity;
    let enemymotionx = time*target.vx;
    let enemymotiony = time*target.vy;
    let playermotionx = unit.v*Math.cos(unit.r);
    let playermotiony = unit.v*Math.sin(unit.r);
    let aimr = aim(newpos, {x: target.x+enemymotionx+playermotionx, y: target.y+enemymotiony+playermotiony});
    renderLine(unit, aimr, 5000, 'green');
    orders.push({id: 'aim', value: vMath(unit, toComponent(dist, aimr), '+')});
    if (dist < 5000) {
        orders.push({id: 'click', value: true});
    } else {
        orders.push({id: 'click', value: false});
    }
} else {
    orders.push({id: 'aim', value: {x: unit.x, y: unit.y}});
    orders.push({id: 'click', value: false});
}
return orders;
`;

const scriptMovementI = `
let orders = [];
orders.push({id: 'w', value: true});
return orders;
`;

const scriptMovementII = `
let orders = [];
if (unit.y > -2000) {
    orders.push({id: 'w', value: true});
} else {
    orders.push({id: 'w', value: false});
    orders.push({id: 'd', value: true});
}
return orders;
`;

const scriptMovementIV = `
let orders = [];

let aDist = 200;
let target = undefined;
let minDist = 9999999;
let minR = 9999999;
for (let i = 1; i < entities.length; i++) {
    let dist = getDist(unit, entities[i]);
    let r = aim(unit, entities[i]);
    if (dist < minDist || (dist < 475 && Math.abs(r - unit.r) < minR)) {
        target = entities[i];
        minDist = dist;
        minR = r;
    }
}

if (!target) {
    target = checkpoint;
    aDist = 50;
}
let xdist = target.x - unit.x;
let ydist = target.y - unit.y;

let dist = getDist(unit, target);
if (Math.abs(dist) > aDist) {
    if (xdist > aDist) {
        orders.push({id: 'd', value: true});
        orders.push({id: 'a', value: false});
    } else if (xdist < -aDist) {
        orders.push({id: 'a', value: true});
        orders.push({id: 'd', value: false});
    } else {
        orders.push({id: 'a', value: false});
        orders.push({id: 'd', value: false});
    }
    if (ydist > aDist) {
        orders.push({id: 's', value: true});
        orders.push({id: 'w', value: false});
    } else if (ydist < -aDist) {
        orders.push({id: 'w', value: true});
        orders.push({id: 's', value: false});
    } else {
        orders.push({id: 'w', value: false});
        orders.push({id: 's', value: false});
    }
} else if (Math.abs(dist) < 125) {
    console
    if (xdist > 0) {
        orders.push({id: 'a', value: true});
        orders.push({id: 'd', value: false});
    } else {
        orders.push({id: 'd', value: true});
        orders.push({id: 'a', value: false});
    }
    if (ydist > 0) {
        orders.push({id: 'w', value: true});
        orders.push({id: 's', value: false});
    } else {
        orders.push({id: 's', value: true});
        orders.push({id: 'w', value: false});
    }
}

let offset = toPol(100, 0);
offset.r += aim(unit, {x: target.x, y: target.y});
offset = toComponent(offset.m, offset.r);
let newpos = vMath(unit, offset, '+');
let aimr = aim(newpos, {x: target.x, y: target.y});

orders.push({id: 'aim', value: vMath(vMath(unit, toComponent(dist, aimr), '+'), {x: randint(0,20)-10, y: randint(0,20)-10}, '+')});
if (dist < 600) {
    orders.push({id: 'click', value: true});
} else {
    orders.push({id: 'click', value: false});
}
return orders;
`;

const scriptAimingI = `
let orders = [];
let target = entities[1];

if (target) {
    let dist = getDist(unit, target);

    let offset = toPol(100, 0);
    offset.r += aim(unit, {x: target.x, y: target.y});
    offset = toComponent(offset.m, offset.r);
    let newpos = vMath(unit, offset, '+');
    let aimr = aim(newpos, {x: target.x, y: target.y});

    orders.push({id: 'aim', value: vMath(unit, toComponent(dist, aimr), '+')});
    orders.push({id: 'click', value: true});
}
return orders;
`;

const scriptAimingII = `
let orders = [];
let target = entities[1];

if (target) {
    orders.push({id: 'aim', value: target});
    orders.push({id: 'click', value: true});
    orders.push({id: 'w', value: true});
} else {
    orders.push({id: 'w', value: false});
    orders.push({id: 's', value: true});
    orders.push({id: 'click', value: false});
}

return orders;
`;

const scriptAimingIII = `
let orders = [];
let target = entities[1];

if (target) {
    let dist = getDist(unit, target);

    let offset = toPol(-100, 0);
    offset.r += aim(unit, {x: target.x, y: target.y});
    offset = toComponent(offset.m, offset.r);
    let newpos = vMath(unit, offset, '+');
    let aimr = aim(newpos, {x: target.x, y: target.y});

    orders.push({id: 'aim', value: vMath(unit, toComponent(dist, aimr), '+')});
    orders.push({id: 'click', value: true});
    orders.push({id: 'w', value: true});
} else {
    orders.push({id: 'w', value: false});
    orders.push({id: 's', value: true});
    orders.push({id: 'click', value: false});
}

return orders;
`;

const scriptAimingIV = `
let orders = [];
let target = undefined;
for (let i = 0; i < entities.length; i++) {
    if (entities[i].team != unit.team) {
        if (target == undefined || getDist(unit, entities[i]) < getDist(unit, target)) {
            target = entities[i];
        }
    }
}
if (target) {
    let dist = getDist(unit, target);
    const bulletVelocity=55;
    let offset = toPol(-100, 0);
    offset.r += aim(unit, {x: target.x, y: target.y});
    offset = toComponent(offset.m, offset.r);
    let newpos = vMath(unit, offset, '+');
    let time = dist/bulletVelocity;
    let enemymotionx = time*target.vx;
    let enemymotiony = time*target.vy;
    let playermotionx = unit.v*Math.cos(unit.r);
    let playermotiony = unit.v*Math.sin(unit.r);
    let aimr = aim(newpos, {x: target.x+enemymotionx+playermotionx, y: target.y+enemymotiony+playermotiony});
    orders.push({id: 'aim', value: vMath(unit, toComponent(dist, aimr), '+')});
    orders.push({id: 'click', value: true});
    orders.push({id: 'w', value: true});
} else {
    orders.push({id: 'w', value: false});
    orders.push({id: 's', value: true});
    orders.push({id: 'click', value: false});
}

return orders;
`;

const scriptCombatI = `
let orders = [];
let target = entities[1];

if (target) {
    orders.push({id: 'aim', value: {x: target.x, y: target.y}});
    orders.push({id: 'click', value: true});
}
return orders;
`;

const scriptCombatII = `
let orders = [];
let target = entities[1];
if (target) {
    let dist = getDist(unit, target);
    let offset = toPol(-100, 0);
    offset.r += aim(unit, {x: target.x, y: target.y});
    offset = toComponent(offset.m, offset.r);
    let newpos = vMath(unit, offset, '+');
    let aimr = aim(newpos, {x: target.x, y: target.y});
    orders.push({id: 'aim', value: vMath(unit, toComponent(dist, aimr), '+')});
    orders.push({id: 'click', value: true});orders.push({id: 'd', value: true});
} else {
    orders.push({id: 'aim', value: {x: unit.x, y: unit.y+1}});
    orders.push({id: 'click', value: false});
    orders.push({id: 'd', value: false});
    orders.push({id: 'a', value: true});
}
return orders;
`;

// The return of the excessively overcomplicated data storage system
const data = {
    constants: {
        zoom: 0.5,
        TPS: 60,
        FPS: 60,
    },
    mech: {
        x: 0,
        y: 0,
        r: 0, // direction of motion
        vx: 0,
        vy: 0,
        mouseR: 0, // current Aim
        lastMoved: 69,
        v: 5, // normal walking speed
        vr: 540 / 60 / 180 * Math.PI, // rotation of tracks (feet)
        tr: 360 / 60 / 180 * Math.PI, // rotation of turret (main body)
        keyboard: [],
        aimPos: {x: 69, y: 69},
        collisionR: 500,
        groundCollisionR: 80,
        tallCollisionR: 150,
        directControl: false,
        noClip: false,
        type: 'mech',
        alive: true,
        parts: [
            {
                id: 'LowerBodyContainer',
                facing: 'body',
                type: 'circle', 
                rOffset: 0,
                size: 35,
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(140, 140, 140, 1)',
                    stroke: {colour: '#696969', width: 5},
                },
                collision: false,
                hp: 1,
                maxHp: 1,
                isHit: 0,
                connected: [
                    {
                        id: 'foot1',
                        type: 'polygon', 
                        facing: 'body',
                        rOffset: 0,
                        size: [
                            {x: -10, y: 60},
                            {x: 10, y: 60},
                            {x: 15, y: 50},
                            {x: 15, y: -50},
                            {x: 10, y: -60},
                            {x: -10, y: -60},
                            {x: -15, y: -50},
                            {x: -15, y: 50},
                        ],
                        offset: {x: -30, y: -5},
                        style: {
                            fill: 'rgba(130, 130, 130, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'foot2',
                        facing: 'body',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -10, y: 60},
                            {x: 10, y: 60},
                            {x: 15, y: 50},
                            {x: 15, y: -50},
                            {x: 10, y: -60},
                            {x: -10, y: -60},
                            {x: -15, y: -50},
                            {x: -15, y: 50},
                        ],
                        offset: {x: 30, y: -5},
                        style: {
                            fill: 'rgba(130, 130, 130, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'lowerBody',
                        facing: 'body',
                        type: 'circle', 
                        rOffset: 0,
                        size: 35,
                        offset: {x: 0, y: 0},
                        style: {
                            fill: 'rgba(140, 140, 140, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                ],
                groundCollision: true,
            },
            {
                id: 'mainBodycontainer',
                facing: 'turret',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -60, y: 40},
                    {x: 60, y: 40},
                    {x: 70, y: 30},
                    {x: 70, y: -30},
                    {x: 60, y: -40},
                    {x: -60, y: -40},
                    {x: -70, y: -30},
                    {x: -70, y: 30},
                ],
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(210, 210, 210, 1)',
                    stroke: {colour: '#696969', width: 10},
                },
                collision: false,
                hp: 1,
                maxHp: 1,
                collideDmg: 0,
                isHit: 0,
                connected: [
                    {
                        id: 'armLeft',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -20, y: 50},
                            {x: 20, y: 50},
                            {x: 25, y: 40},
                            {x: 25, y: -60},
                            {x: 20, y: -70},
                            {x: -20, y: -70},
                            {x: -25, y: -60},
                            {x: -25, y: 40},
                        ],
                        offset: {x: -100, y: 0},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: '#696969', width: 10},
                        },
                        collision: true,
                        hp: 3000,
                        maxHp: 3000,
                        collideDmg: 500,
                        isHit: 0,
                        connected: [
                            {
                                id: 'leftArmMain',
                                type: 'circle', 
                                facing: 'body',
                                rOffset: 0,
                                size: 0,
                                offset: {x: 0, y: 0},
                                style: {
                                    fill: 'rgba(0, 0, 0, 0)',
                                    stroke: {colour: 'rgba(0, 0, 0, 0)', width: 1},
                                },
                                collision: false,
                                hp: 1,
                                maxHp: 1,
                                isHit: 0,
                                connected: [],
                            },
                            {
                                id: 'leftArmSide',
                                type: 'circle', 
                                facing: 'body',
                                rOffset: 0,
                                size: 0,
                                offset: {x: 0, y: 0},
                                style: {
                                    fill: 'rgba(0, 0, 0, 0)',
                                    stroke: {colour: 'rgba(0, 0, 0, 0)', width: 1},
                                },
                                collision: false,
                                hp: 1,
                                maxHp: 1,
                                isHit: 0,
                                connected: [],
                            },
                        ],
                    },
                    {
                        id: 'armRight',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -20, y: 50},
                            {x: 20, y: 50},
                            {x: 25, y: 40},
                            {x: 25, y: -60},
                            {x: 20, y: -70},
                            {x: -20, y: -70},
                            {x: -25, y: -60},
                            {x: -25, y: 40},
                        ],
                        offset: {x: 100, y: 0},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: '#696969', width: 10},
                        },
                        collision: true,
                        hp: 3000,
                        maxHp: 3000,
                        collideDmg: 500,
                        isHit: 0,
                        connected: [
                            {
                                id: 'rightArmMain',
                                type: 'circle', 
                                facing: 'body',
                                rOffset: 0,
                                size: 0,
                                offset: {x: 0, y: 0},
                                style: {
                                    fill: 'rgba(0, 0, 0, 0)',
                                    stroke: {colour: 'rgba(0, 0, 0, 0)', width: 1},
                                },
                                collision: false,
                                hp: 1,
                                maxHp: 1,
                                isHit: 0,
                                connected: [],
                            },
                            {
                                id: 'rightArmSide',
                                type: 'circle', 
                                facing: 'body',
                                rOffset: 0,
                                size: 0,
                                offset: {x: 0, y: 0},
                                style: {
                                    fill: 'rgba(0, 0, 0, 0)',
                                    stroke: {colour: 'rgba(0, 0, 0, 0)', width: 1},
                                },
                                collision: false,
                                hp: 1,
                                maxHp: 1,
                                isHit: 0,
                                connected: [],
                            },
                        ],
                    },
                    {
                        id: 'mainBody',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -60, y: 40},
                            {x: 60, y: 40},
                            {x: 70, y: 30},
                            {x: 70, y: -30},
                            {x: 60, y: -40},
                            {x: -60, y: -40},
                            {x: -70, y: -30},
                            {x: -70, y: 30},
                        ],
                        offset: {x: 0, y: 0},
                        style: {
                            fill: 'rgba(210, 210, 210, 1)',
                            stroke: {colour: '#696969', width: 10},
                        },
                        collision: true,
                        hp: 5000,
                        maxHp: 5000,
                        collideDmg: 500,
                        isHit: 0,
                        core: true,
                        connected: [
                            {
                                id: 'back',
                                type: 'circle', 
                                facing: 'body',
                                rOffset: 0,
                                size: 0,
                                offset: {x: 0, y: 0},
                                style: {
                                    fill: 'rgba(0, 0, 0, 0)',
                                    stroke: {colour: 'rgba(0, 0, 0, 0)', width: 1},
                                },
                                collision: false,
                                hp: 1,
                                maxHp: 1,
                                isHit: 0,
                                connected: [],
                            },
                        ],
                    },
                    {
                        id: 'head',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 25,
                        offset: {x: 0, y: 0},
                        style: {
                            fill: 'rgba(69, 69, 69, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [
                            {
                                id: 'headTurret',
                                type: 'circle', 
                                facing: 'body',
                                rOffset: 0,
                                size: 0,
                                offset: {x: 0, y: 0},
                                style: {
                                    fill: 'rgba(0, 0, 0, 0)',
                                    stroke: {colour: 'rgba(0, 0, 0, 0)', width: 1},
                                },
                                collision: false,
                                hp: 1,
                                maxHp: 1,
                                isHit: 0,
                                connected: [],
                            },
                        ],
                    },
                ],
            },
        ],
        effects: [],
    },
    skibidiToilet: {
        x: 0,
        y: 0,
        r: 0, // direction of motion
        vx: 0,
        vy: 0,
        mouseR: 0, // current Aim
        v: 7.5, // top speed
        tr: 360 / 60 / 180 * Math.PI, // rotation of turret (main body)
        vr: Math.PI/120,
        keyboard: [],
        aimPos: {x: 69, y: 69},
        collisionR: 300,
        groundCollisionR: 0,
        tallCollisionR: 0,
        isMoving: false,
        directControl: false,
        noClip: false,
        type: 'tank',
        alive: true,
        hitbox: [
            {
                id: 'skibidi toilet',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -25, y: -50}, 
                    {x: 25, y: -50}, 
                    {x: 15, y: 30}, 
                    {x: -15, y: 30}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
            },
        ],
        parts: [
            {
                id: 'toiletBody',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -20, y: 0}, 
                    {x: -20, y: 10}, 
                    {x: -15, y: 25}, 
                    {x: -5, y: 33}, 
                    {x: 0, y: 34}, 
                    {x: 5, y: 33}, 
                    {x: 15, y: 25}, 
                    {x: 20, y: 10}, 
                    {x: 20, y: 0}, 
                    {x: 17, y: -20}, 
                    {x: -17, y: -20}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(200, 200, 200, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'toiletBowl',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: 0, y: -13}, 
                    {x: -5, y: -12}, 
                    {x: -10, y: -9}, 
                    {x: -13, y: -5}, 
                    {x: -15, y: 5}, 
                    {x: -13, y: 17}, 
                    {x: -10, y: 23}, 
                    {x: -5, y: 27}, 
                    {x: 0, y: 28}, 
                    {x: 5, y: 27}, 
                    {x: 10, y: 23}, 
                    {x: 13, y: 17}, 
                    {x: 15, y: 5}, 
                    {x: 13, y: -5}, 
                    {x: 10, y: -9}, 
                    {x: 5, y: -12}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(150, 150, 150, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'toiletBowlShade',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: 0, y: -13}, 
                    {x: -5, y: -12}, 
                    {x: -10, y: -9}, 
                    {x: -13, y: -5}, 
                    {x: -15, y: 5}, 
                    {x: -13, y: 9}, 
                    {x: -10, y: 12}, 
                    {x: -5, y: 14}, 
                    {x: 0, y: 15}, 
                    {x: 5, y: 14}, 
                    {x: 10, y: 12}, 
                    {x: 13, y: 9}, 
                    {x: 15, y: 5}, 
                    {x: 13, y: -5}, 
                    {x: 10, y: -9}, 
                    {x: 5, y: -12}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(0, 0, 0, 0.2)',
                    stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                },
            },
            {
                id: 'toiletDeco1',
                facing: 'body',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -12, y: 7}, 
                    {x: -12, y: -7}, 
                    {x: 12, y: -7}, 
                    {x: 12, y: 7}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: 50, y: 75},
                style: {
                    fill: 'rgba(175, 175, 175, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'toiletDeco2',
                facing: 'body',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -12, y: 7}, 
                    {x: -12, y: -7}, 
                    {x: 12, y: -7}, 
                    {x: 12, y: 7}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: -50, y: 75},
                style: {
                    fill: 'rgba(175, 175, 175, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'waterTankSide',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -17, y: -20}, 
                    {x: -25, y: -35}, 
                    {x: 25, y: -35}, 
                    {x: 17, y: -20}, 
                    ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(150, 150, 150, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'waterTankTop',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -25, y: -35}, 
                    {x: -25, y: -55}, 
                    {x: 25, y: -55}, 
                    {x: 25, y: -35}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(200, 200, 200, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'flushButton',
                facing: 'body',
                type: 'circle', 
                rOffset: 0,
                size: 20,
                scale: {x: 1, y: 1},
                offset: {x: 0, y: 180},
                style: {
                    fill: 'rgba(175, 175, 175, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'waterTankShade',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -23, y: -35}, 
                    {x: -20, y: -41}, 
                    {x: -15, y: -44}, 
                    {x: -5, y: -48}, 
                    {x: 5, y: -48}, 
                    {x: 15, y: -44}, 
                    {x: 20, y: -41}, 
                    {x: 23, y: -35}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(0, 0, 0, 0.1)',
                    stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                },
            },
            {
                id: 'toiletSeat',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -18, y: -20}, 
                    {x: -23, y: -25}, 
                    {x: -24, y: -30}, 
                    {x: -22, y: -35}, 
                    {x: -20, y: -38}, 
                    {x: -15, y: -41}, 
                    {x: -5, y: -43}, 
                    {x: 5, y: -43}, 
                    {x: 15, y: -41}, 
                    {x: 20, y: -38}, 
                    {x: 22, y: -35}, 
                    {x: 24, y: -30}, 
                    {x: 23, y: -25}, 
                    {x: 18, y: -20}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(200, 200, 200, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'toiletSeatInner',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -18, y: -20}, 
                    {x: -23, y: -25}, 
                    {x: -24, y: -30}, 
                    {x: -22, y: -35}, 
                    {x: -20, y: -38}, 
                    {x: -15, y: -41}, 
                    {x: -5, y: -43}, 
                    {x: 5, y: -43}, 
                    {x: 15, y: -41}, 
                    {x: 20, y: -38}, 
                    {x: 22, y: -35}, 
                    {x: 24, y: -30}, 
                    {x: 23, y: -25}, 
                    {x: 18, y: -20}, 
                ],
                scale: {x: 3, y: 3},
                offset: {x: 0, y: 7},
                style: {
                    fill: 'rgba(195, 195, 195, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'toiletSeatDeco1',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI/3,
                size: [
                    {x: -12, y: 7}, 
                    {x: -12, y: -7}, 
                    {x: 12, y: -7}, 
                    {x: 12, y: 7}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: -77, y: 130},
                style: {
                    fill: 'rgba(175, 175, 175, 1)',
                    stroke: {colour: 'rgba(150, 150, 150, 1)', width: 5},
                },
            },
            {
                id: 'toiletSeatDeco2',
                facing: 'body',
                type: 'polygon', 
                rOffset: -Math.PI/3,
                size: [
                    {x: -12, y: 7}, 
                    {x: -12, y: -7}, 
                    {x: 12, y: -7}, 
                    {x: 12, y: 7}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: 77, y: 130},
                style: {
                    fill: 'rgba(175, 175, 175, 1)',
                    stroke: {colour: 'rgba(150, 150, 150, 1)', width: 5},
                },
            },
            {
                id: 'head',
                facing: 'body',
                type: 'circle', 
                rOffset: 0,
                size: 50,
                scale: {x: 1, y: 1},
                offset: {x: 0, y: -20},
                style: {
                    fill: 'rgba(235, 197, 139, 1)',
                    stroke: {colour: 'rgba(191, 140, 84, 1)', width: 5},
                },
            },
            {
                id: 'eye1',
                facing: 'body',
                type: 'circle', 
                rOffset: -Math.PI/6,
                size: 8,
                scale: {x: 1.2, y: 1},
                offset: {x: -29, y: -35},
                style: {
                    fill: 'rgba(255, 255, 255, 1)',
                    stroke: {colour: 'rgba(0, 0, 0, 0.7)', width: 1},
                },
            },
            {
                id: 'eye2',
                facing: 'body',
                type: 'circle', 
                rOffset: Math.PI/6,
                size: 8,
                scale: {x: 1.2, y: 1},
                offset: {x: 29, y: -35},
                style: {
                    fill: 'rgba(255, 255, 255, 1)',
                    stroke: {colour: 'rgba(0, 0, 0, 0.7)', width: 1},
                },
            },
            {
                id: 'pupil1',
                facing: 'body',
                type: 'circle', 
                rOffset: -Math.PI/6,
                size: 4,
                scale: {x: 1.2, y: 1},
                offset: {x: -30, y: -38},
                style: {
                    fill: 'rgba(0, 0, 0, 1)',
                    stroke: {colour: 'rgba(0, 0, 0, 0.7)', width: 1},
                },
            },
            {
                id: 'pupil1',
                facing: 'body',
                type: 'circle', 
                rOffset: Math.PI/6,
                size: 4,
                scale: {x: 1.2, y: 1},
                offset: {x: 30, y: -38},
                style: {
                    fill: 'rgba(0, 0, 0, 1)',
                    stroke: {colour: 'rgba(0, 0, 0, 0.7)', width: 1},
                },
            },
            {
                id: 'eyebrow1',
                facing: 'body',
                type: 'polygon', 
                rOffset: -Math.PI/6,
                size: [
                    {x: -12, y: 4}, 
                    {x: -12, y: -4}, 
                    {x: 12, y: -4}, 
                    {x: 12, y: 4}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: -27, y: -28},
                style: {
                    fill: 'rgba(0, 0, 0, 0.6)',
                    stroke: {colour: 'rgba(150, 150, 150, 0)', width: 5},
                },
            },
            {
                id: 'eyebrow2',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI/6,
                size: [
                    {x: -12, y: 4}, 
                    {x: -12, y: -4}, 
                    {x: 12, y: -4}, 
                    {x: 12, y: 4}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: 27, y: -28},
                style: {
                    fill: 'rgba(0, 0, 0, 0.6)',
                    stroke: {colour: 'rgba(150, 150, 150, 0)', width: 5},
                },
            },
            {
                id: 'toiletBowlShade',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -20, y: 0}, 
                    {x: -15, y: 5}, 
                    {x: -10, y: 7}, 
                    {x: 0, y: 8}, 
                    {x: 10, y: 7}, 
                    {x: 15, y: 5}, 
                    {x: 20, y: 0}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: 0, y: -50},
                style: {
                    fill: 'rgba(0, 0, 0, 0.6)',
                    stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                },
            },
        ],
        effects: [],
    },
    template: {
        physics: {
            x: 0,     // x coordinate
            y: 0,     // y coordinate
            vx: 0,    // x component of velocity
            vy: 0,    // y component of velocity
            ax: 0,    // x component of acceleration
            ay: 0,    // y component of acceleration
            r: 0,     // rotation
            vr: 0,    // angular velocity
            ar: 0,    // angular acceleration
            vDrag: 1, // drag (multiply by velocities to slow them down)
            rDrag: 1, // angular drag (multiply by velocities to slow them down)
            maxV: 25, // terminal velocity (25pixels/tick)
            maxRV: Math.PI/15, // terminal angular velocity (720˚/second)
        },
        particle: {
            type: 'circle', // circle or polygon
            size: 10, // radius if circle, array of points if polygon
            style: {
                fill: {r: 255, g: 255, b: 255, a: 1},
                stroke: {colour: {r: 255, g: 255, b: 255, a: 1}, width: 2},
            },
            decay: {
                life: Infinity, // how many ticks the particle persists for
                fillStyle: {r: 0, g: 0, b: 0, a: 0}, // add to fill style
                strokeStyle: {r: 0, g: 0, b: 0, a: 0}, // add to stroke style
                size: 1 // multiply size by this
            }
        },
        memory: {
            team: '', // which team the unit belongs to
            id: '', // the name of the unit
            memory: '', // the stored data of the unit, should store enemies to target and where to move to
            transmission: [], // data recieved from the main combat logic, should be given targets to attack or formations to move in
            script: '', // the script to be executed by the unit every tick
            orders: [], // all the actions that the unit will execute
        },
        team: {
            id: '', // the team name
            money: 10000, // money avalaible to purchace units and resources
            script: '', // the script that purchaces new units and sends commands to existing units
            memory: '', // the main data storage of every team, should store advanced tactics and strategies
            transmission: [], // data recieved from units
            resources: {
                scripts: 3, // number of different scripts avalaible, scripts-1 = number of different types of units
                mainScriptLength: 2000, // main logic has limit of 1000 characters
                UnitScriptLength: 5000, // unit scripts have a limit of 4000 characters
            },
            scripts: { // scripts owned by the team

            },
            spawn: {x: 0, y: 0}, // where new units will be spawned
            orders: [], // orders to be executed by the team (spawn stuff)
        },
        weapons: {
            DebugWeapon: {
                id: 'debugWeapon',
                facing: 'turret',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -10, y: 0},
                    {x: 10, y: 0},
                    {x: 10, y: 30},
                    {x: -10, y: 30},
                ],
                offset: {x: 0, y: -100},
                style: {
                    fill: 'rgba(150, 150, 150, 1)',
                    stroke: {colour: '#696969', width: 5},
                },
                cannon: {
                    keybind: 'click',
                    x: 0,
                    y: 0,
                    reload: {c: 0, t: 6},
                    spread: 0,
                    bullet: {
                        type: 'circle', 
                        cType: 'point', 
                        size: 8,
                        style: {
                            fill: {r: 100, g: 100, b: 100, a: 1},
                            stroke: {colour: {r: 69, g: 69, b: 69, a: 1}, width: 3},
                        },
                        decay: {
                            life: 999999999, 
                            fillStyle: {r: 0, g: 0, b: 0, a: 0}, 
                            strokeStyle: {r: 0, g: 0, b: 0, a: 0}, 
                            size: 1
                        },
                        dmg: 1,
                        v: 0,
                        vr: 0,
                        vDrag: 0.99,
                        rDrag: 0,
                        friendly: true,
                    },
                },
                collision: false,
                hp: 1,
                maxHp: 1,
                isHit: 0,
                connected: [],
            },
            none: {
                id: 'none',
                facing: 'body',
                type: 'circle', 
                rOffset: 0,
                size: 0,
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(0, 0, 0, 0)',
                    stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                },
                collision: false,
                hp: 0,
                maxHp: 0,
                isHit: 0,
                connected: [],
            },
            noneSideMounted: {
                id: 'none',
                facing: 'body',
                type: 'circle', 
                rOffset: 0,
                size: 0,
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(0, 0, 0, 0)',
                    stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                },
                collision: false,
                hp: 0,
                maxHp: 0,
                isHit: 0,
                connected: [],
            },
            GattlingGun: {
                id: 'GattlingGunContainer',
                facing: 'turret',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -30, y: 0},
                    {x: 30, y: 0},
                    {x: 30, y: 20},
                    {x: -30, y: 20},
                ],
                offset: {x: 0, y: -90},
                style: {
                    fill: 'rgba(150, 150, 150, 1)',
                    stroke: {colour: '#696969', width: 5},
                },
                collision: false,
                hp: 1,
                maxHp: 1,
                isHit: 0,
                connected: [
                    {
                        id: 'GattlingGunBarrel1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -10, y: 0},
                            {x: 10, y: 0},
                            {x: 10, y: 100},
                            {x: -10, y: 100},
                        ],
                        offset: {x: 15, y: -190},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'GattlingGunBarrel2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -10, y: 0},
                            {x: 10, y: 0},
                            {x: 10, y: 100},
                            {x: -10, y: 100},
                        ],
                        offset: {x: -15, y: -190},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'GattlingGunMainBarrel',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -10, y: 0},
                            {x: 10, y: 0},
                            {x: 10, y: 110},
                            {x: -10, y: 110},
                        ],
                        offset: {x: 0, y: -200},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 45, t: 1},
                            spread: Math.PI/24,
                            bullet: {
                                type: 'circle', 
                                cType: 'point', 
                                size: 5,
                                style: {
                                    fill: {r: 100, g: 100, b: 100, a: 1},
                                    stroke: {colour: {r: 69, g: 69, b: 69, a: 1}, width: 2},
                                },
                                decay: {
                                    life: 100, 
                                    fillStyle: {r: 0, g: 0, b: 0, a: 0}, 
                                    strokeStyle: {r: 0, g: 0, b: 0, a: 0}, 
                                    size: 1
                                },
                                dmg: 20,
                                v: 25,
                                vDrag: 0.99,
                                vr: 0,
                                rDrag: 0,
                                friendly: true,
                            },
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'GattlingGunPart',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -30, y: 0},
                            {x: 30, y: 0},
                            {x: 30, y: 10},
                            {x: -30, y: 10},
                        ],
                        offset: {x: 0, y: -150},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                ],
            },
            BasicGun: {
                id: 'basicGun',
                facing: 'turret',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -10, y: 0},
                    {x: 10, y: 0},
                    {x: 10, y: 30},
                    {x: -10, y: 30},
                ],
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(150, 150, 150, 1)',
                    stroke: {colour: '#696969', width: 5},
                },
                cannon: {
                    keybind: 'click',
                    x: 0,
                    y: 0,
                    reload: {c: 6, t: 25},
                    spread: Math.PI/48/2,
                    bullet: {
                        type: 'circle', 
                        cType: 'point', 
                        size: 8,
                        style: {
                            fill: {r: 100, g: 100, b: 100, a: 1},
                            stroke: {colour: {r: 69, g: 69, b: 69, a: 1}, width: 3},
                        },
                        decay: {
                            life: 100, 
                            fillStyle: {r: 0, g: 0, b: 0, a: 0}, 
                            strokeStyle: {r: 0, g: 0, b: 0, a: 0}, 
                            size: 1
                        },
                        dmg: 50,
                        v: 20,
                        vDrag: 0.99,
                        vr: 0,
                        rDrag: 0,
                        friendly: true,
                    },
                },
                collision: false,
                hp: 1,
                maxHp: 1,
                isHit: 0,
                connected: [],
            },
            GunTurret: {
                id: 'gunTurretBase',
                facing: 'body',
                type: 'circle', 
                rOffset: 0,
                size: 15,
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(150, 150, 150, 1)',
                    stroke: {colour: '#696969', width: 5},
                },
                collision: false,
                hp: 1,
                maxHp: 1,
                isHit: 0,
                connected: [
                    {
                        id: 'basicGun',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: 60},
                            {x: -8, y: 60},
                        ],
                        offset: {x: 0, y: -50},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 6, t: 20},
                            spread: Math.PI/48/2,
                            bullet: {
                                type: 'circle', 
                                cType: 'point', 
                                size: 6,
                                style: {
                                    fill: {r: 100, g: 100, b: 100, a: 1},
                                    stroke: {colour: {r: 69, g: 69, b: 69, a: 1}, width: 3},
                                },
                                decay: {
                                    life: 100, 
                                    fillStyle: {r: 0, g: 0, b: 0, a: 0}, 
                                    strokeStyle: {r: 0, g: 0, b: 0, a: 0}, 
                                    size: 1
                                },
                                dmg: 50,
                                v: 30,
                                vDrag: 0.99,
                                vr: 0,
                                rDrag: 0,
                                friendly: true,
                            },
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'gunTurretBase',
                        facing: 'body',
                        type: 'circle', 
                        rOffset: 0,
                        size: 15,
                        offset: {x: 0, y: 0},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    }
                ],
            },
            LightMachineGun: {
                id: 'LightMachineGun',
                facing: 'turret',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -10, y: 0},
                    {x: 10, y: 0},
                    {x: 10, y: 30},
                    {x: -10, y: 30},
                ],
                offset: {x: 0, y: -100},
                style: {
                    fill: 'rgba(150, 150, 150, 1)',
                    stroke: {colour: '#696969', width: 5},
                },
                cannon: {
                    keybind: 'click',
                    x: 0,
                    y: 0,
                    reload: {c: 6, t: 15},
                    spread: Math.PI/48/4,
                    bullet: {
                        type: 'circle', 
                        cType: 'point', 
                        size: 8,
                        style: {
                            fill: {r: 100, g: 100, b: 100, a: 1},
                            stroke: {colour: {r: 69, g: 69, b: 69, a: 1}, width: 3},
                        },
                        decay: {
                            life: 120, 
                            fillStyle: {r: 0, g: 0, b: 0, a: 0}, 
                            strokeStyle: {r: 0, g: 0, b: 0, a: 0}, 
                            size: 1
                        },
                        dmg: 100,
                        v: 20,
                        vDrag: 0.99,
                        vr: 0,
                        rDrag: 0,
                        friendly: true,
                    },
                },
                collision: false,
                hp: 1,
                maxHp: 1,
                isHit: 0,
                connected: [],
            },
            CannonSideMounted: {
                id: 'cannonSideMounted',
                facing: 'turret',
                type: 'polygon', 
                rOffset: 5*Math.PI/180,
                size: [
                    {x: -10, y: -10},
                    {x: 10, y: -10},
                    {x: 10, y: 70},
                    {x: -10, y: 70},
                ],
                offset: {x: 5, y: -90},
                style: {
                    fill: 'rgba(150, 150, 150, 1)',
                    stroke: {colour: '#696969', width: 5},
                },
                cannon: {
                    keybind: 'click',
                    x: 0,
                    y: 0,
                    reload: {c: 6, t: 15},
                    spread: Math.PI/48/4,
                    bullet: {
                        type: 'circle', 
                        cType: 'point', 
                        size: 8,
                        style: {
                            fill: {r: 100, g: 100, b: 100, a: 1},
                            stroke: {colour: {r: 69, g: 69, b: 69, a: 1}, width: 3},
                        },
                        decay: {
                            life: 120, 
                            fillStyle: {r: 0, g: 0, b: 0, a: 0}, 
                            strokeStyle: {r: 0, g: 0, b: 0, a: 0}, 
                            size: 1
                        },
                        dmg: 100,
                        v: 20,
                        vDrag: 0.99,
                        vr: 0,
                        rDrag: 0,
                        friendly: true,
                    },
                },
                collision: false,
                hp: 1,
                maxHp: 1,
                isHit: 0,
                connected: [
                    {
                        id: 'mount',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 30, y: -20},
                            {x: 30, y: 20},
                            {x: 0, y: 15},
                            {x: 0, y: -15},
                        ],
                        offset: {x: -10, y: -10},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                ],
            },
            PlasmaMachineGun: {
                id: 'PlasmaMachineGun',
                facing: 'turret',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -8, y: 0},
                    {x: 8, y: 0},
                    {x: 8, y: 100},
                    {x: -8, y: 100},
                ],
                offset: {x: 0, y: -170},
                style: {
                    fill: 'rgba(120, 120, 120, 1)',
                    stroke: {colour: '#696969', width: 5},
                },
                cannon: {
                    keybind: 'click',
                    x: 0,
                    y: 0,
                    reload: {c: 6, t: 30},
                    spread: Math.PI/36,
                    bullet: {
                        type: 'circle', 
                        cType: 'point', 
                        size: 6,
                        style: {
                            fill: {r: 100, g: 100, b: 255, a: 1},
                            stroke: {colour: {r: 50, g: 50, b: 150, a: 1}, width: 1},
                        },
                        decay: {
                            life: 250, 
                            fillStyle: {r: 0, g: 0, b: 0, a: 0}, 
                            strokeStyle: {r: 0, g: 0, b: 0, a: 0}, 
                            size: 1
                        },
                        dmg: 500,
                        v: 15,
                        vDrag: 1,
                        vr: 0,
                        rDrag: 0,
                        friendly: true,
                    },
                },
                collision: false,
                hp: 1,
                maxHp: 1,
                isHit: 0,
                connected: [
                    {
                        id: 'MachineGunBarrel',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -10, y: -40},
                            {x: 10, y: -40},
                            {x: 10, y: 30},
                            {x: -10, y: 30},
                        ],
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'lightMachineGunBarrelDeco1.1',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 5,
                        offset: {x: 0, y: -80},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'lightMachineGunBarrelDeco1.2',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 5,
                        offset: {x: 0, y: -92},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'lightMachineGunBarrelDeco1.3',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 5,
                        offset: {x: 0, y: -104},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'lightMachineGunBarrelDeco1.4',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 5,
                        offset: {x: 0, y: -116},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'lightMachineGunBarrelDeco1.5',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 5,
                        offset: {x: 0, y: -128},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                ],
            },
            PlasmaMachineGunSideMounted: {
                id: 'PlasmaMachineGun',
                facing: 'turret',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -8, y: 0},
                    {x: 8, y: 0},
                    {x: 8, y: 100},
                    {x: -8, y: 100},
                ],
                offset: {x: 0, y: -150},
                style: {
                    fill: 'rgba(120, 120, 120, 1)',
                    stroke: {colour: '#696969', width: 5},
                },
                cannon: {
                    keybind: 'click',
                    x: 0,
                    y: 0,
                    reload: {c: 6, t: 30},
                    spread: Math.PI/36,
                    bullet: {
                        type: 'circle', 
                        cType: 'point', 
                        size: 6,
                        style: {
                            fill: {r: 100, g: 100, b: 255, a: 1},
                            stroke: {colour: {r: 50, g: 50, b: 150, a: 1}, width: 1},
                        },
                        decay: {
                            life: 250, 
                            fillStyle: {r: 0, g: 0, b: 0, a: 0}, 
                            strokeStyle: {r: 0, g: 0, b: 0, a: 0}, 
                            size: 1
                        },
                        dmg: 500,
                        v: 15,
                        vDrag: 1,
                        vr: 0,
                        rDrag: 0,
                        friendly: true,
                    },
                },
                collision: false,
                hp: 1,
                maxHp: 1,
                isHit: 0,
                connected: [
                    {
                        id: 'MachineGunBarrel',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -10, y: -40},
                            {x: 10, y: -40},
                            {x: 10, y: 30},
                            {x: -10, y: 30},
                        ],
                        offset: {x: 0, y: -80},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'lightMachineGunBarrelDeco1.1',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 5,
                        offset: {x: 0, y: -60},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'lightMachineGunBarrelDeco1.2',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 5,
                        offset: {x: 0, y: -72},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'lightMachineGunBarrelDeco1.3',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 5,
                        offset: {x: 0, y: -84},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'lightMachineGunBarrelDeco1.4',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 5,
                        offset: {x: 0, y: -96},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'lightMachineGunBarrelDeco1.5',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 5,
                        offset: {x: 0, y: -108},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'mount',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 30, y: -20},
                            {x: 30, y: 20},
                            {x: 0, y: 15},
                            {x: 0, y: -15},
                        ],
                        offset: {x: -10, y: -30},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                ],
            },
            MediumMachineGun: {
                id: 'mediumMachineGun',
                facing: 'turret',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -10, y: 0},
                    {x: 10, y: 0},
                    {x: 10, y: 100},
                    {x: -10, y: 100},
                ],
                offset: {x: 0, y: -170},
                style: {
                    fill: 'rgba(120, 120, 120, 1)',
                    stroke: {colour: '#696969', width: 5},
                },
                cannon: {
                    keybind: 'click',
                    x: 0,
                    y: 0,
                    reload: {c: 6, t: 6},
                    spread: Math.PI/24,
                    bullet: {
                        type: 'circle', 
                        cType: 'point', 
                        size: 6,
                        style: {
                            fill: {r: 100, g: 100, b: 100, a: 1},
                            stroke: {colour: {r: 69, g: 69, b: 69, a: 1}, width: 3},
                        },
                        decay: {
                            life: 120, 
                            fillStyle: {r: 0, g: 0, b: 0, a: 0}, 
                            strokeStyle: {r: 0, g: 0, b: 0, a: 0}, 
                            size: 1
                        },
                        dmg: 60,
                        v: 40,
                        vDrag: 0.99,
                        vr: 0,
                        rDrag: 0,
                        friendly: true,
                    },
                },
                collision: false,
                hp: 1,
                maxHp: 1,
                isHit: 0,
                connected: [
                    {
                        id: 'lightMachineGunBarrel',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -15, y: -40},
                            {x: 15, y: -40},
                            {x: 15, y: 30},
                            {x: -15, y: 30},
                        ],
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'lightMachineGunBarrelDeco1.1',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 5,
                        offset: {x: 6, y: -80},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'lightMachineGunBarrelDeco1.2',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 5,
                        offset: {x: 6, y: -92},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'lightMachineGunBarrelDeco1.3',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 5,
                        offset: {x: 6, y: -104},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'lightMachineGunBarrelDeco1.4',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 5,
                        offset: {x: 6, y: -116},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'lightMachineGunBarrelDeco1.5',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 5,
                        offset: {x: 6, y: -128},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'lightMachineGunBarrelDeco2.1',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 5,
                        offset: {x: -6, y: -75},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'lightMachineGunBarrelDeco2.2',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 5,
                        offset: {x: -6, y: -87},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'lightMachineGunBarrelDeco2.3',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 5,
                        offset: {x: -6, y: -99},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'lightMachineGunBarrelDeco2.4',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 5,
                        offset: {x: -6, y: -111},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'lightMachineGunBarrelDeco2.5',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 5,
                        offset: {x: -6, y: -123},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'lightMachineGunBarrelDeco2.6',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 5,
                        offset: {x: -6, y: -135},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                ],
            },
            HeavyMachineGun: {
                id: 'GattlingGunContainer',
                facing: 'turret',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -30, y: 0},
                    {x: 30, y: 0},
                    {x: 30, y: 20},
                    {x: -30, y: 20},
                ],
                offset: {x: 0, y: -90},
                style: {
                    fill: 'rgba(150, 150, 150, 1)',
                    stroke: {colour: '#696969', width: 5},
                },
                collision: false,
                hp: 1,
                maxHp: 1,
                isHit: 0,
                connected: [
                    {
                        id: 'GattlingGunBarrel1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -10, y: 0},
                            {x: 10, y: 0},
                            {x: 10, y: 100},
                            {x: -10, y: 100},
                        ],
                        offset: {x: 15, y: -190},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'GattlingGunBarrel2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -10, y: 0},
                            {x: 10, y: 0},
                            {x: 10, y: 100},
                            {x: -10, y: 100},
                        ],
                        offset: {x: -15, y: -190},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'GattlingGunMainBarrel',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -10, y: 0},
                            {x: 10, y: 0},
                            {x: 10, y: 110},
                            {x: -10, y: 110},
                        ],
                        offset: {x: 0, y: -200},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 45, t: 2},
                            spread: Math.PI/12,
                            bullet: {
                                type: 'circle', 
                                cType: 'point', 
                                size: 8,
                                style: {
                                    fill: {r: 100, g: 100, b: 100, a: 1},
                                    stroke: {colour: {r: 69, g: 69, b: 69, a: 1}, width: 2},
                                },
                                decay: {
                                    life: 150, 
                                    fillStyle: {r: 0, g: 0, b: 0, a: 0}, 
                                    strokeStyle: {r: 0, g: 0, b: 0, a: 0}, 
                                    size: 1
                                },
                                dmg: 100,
                                v: 60,
                                vDrag: 0.99,
                                vr: 0,
                                rDrag: 0,
                                friendly: true,
                            },
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'GattlingGunPart',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -30, y: 0},
                            {x: 30, y: 0},
                            {x: 30, y: 10},
                            {x: -30, y: 10},
                        ],
                        offset: {x: 0, y: -150},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                ],
            },
            SpikeLauncher: {
                id: 'spikeLauncher',
                facing: 'turret',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -30, y: -30},
                    {x: 30, y: -30},
                    {x: 10, y: 0},
                    {x: -10, y: 0},
                ],
                offset: {x: 0, y: -70},
                style: {
                    fill: 'rgba(150, 150, 150, 1)',
                    stroke: {colour: '#696969', width: 5},
                },
                cannon: {
                    keybind: 'click',
                    x: 0,
                    y: -40,
                    reload: {c: 0, t: 120},
                    delay: {c: 0, t: 0},
                    spread: Math.PI/24,
                    bullet: {
                        type: 'polygon',
                        cType: 'point',  
                        size: [
                            {x: 0, y: 5*4},
                            {x: -1.299*4, y: 0.75*4},
                            {x: -4.330*4, y: -2.5*4},
                            {x: 0, y: -1.5*4},
                            {x: 4.330*4, y: -2.5*4},
                            {x: 1.299*4, y: 0.75*4}
                        ],
                        style: {
                            fill: {r: 255, g: 100, b: 50, a: 1},
                            stroke: {colour: {r: 255, g: 0, b: 0, a: 1}, width: 3},
                        },
                        decay: {
                            life: 1500, 
                            fillStyle: {r: -0.01, g: 0, b: 0, a: 0}, 
                            strokeStyle: {r: -0.01, g: 0, b: 0, a: 0}, 
                            size: 1.0005
                        },
                        dmg: 1000,
                        v: 20,
                        vDrag: 0.97,
                        vr: Math.PI/20,
                        rDrag: 0.98,
                    },
                },
                collision: false,
                hp: 1,
                maxHp: 1,
                isHit: 0,
                connected: [
                    {
                        id: 'spikeLauncherBarrel1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -30, y: -30},
                            {x: 30, y: -30},
                            {x: 10, y: 0},
                            {x: -10, y: 0},
                        ],
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: -40,
                            reload: {c: 0, t: 120},
                            delay: {c: 5, t: 5},
                            spread: Math.PI/24,
                            bullet: {
                                type: 'polygon',
                                cType: 'point',  
                                size: [
                                    {x: 0, y: 5*4},
                                    {x: -1.299*4, y: 0.75*4},
                                    {x: -4.330*4, y: -2.5*4},
                                    {x: 0, y: -1.5*4},
                                    {x: 4.330*4, y: -2.5*4},
                                    {x: 1.299*4, y: 0.75*4}
                                ],
                                style: {
                                    fill: {r: 255, g: 100, b: 50, a: 1},
                                    stroke: {colour: {r: 255, g: 0, b: 0, a: 1}, width: 3},
                                },
                                decay: {
                                    life: 1500, 
                                    fillStyle: {r: -0.01, g: 0, b: 0, a: 0}, 
                                    strokeStyle: {r: -0.01, g: 0, b: 0, a: 0}, 
                                    size: 1.0005
                                },
                                dmg: 1000,
                                v: 20,
                                vDrag: 0.97,
                                vr: Math.PI/20,
                                rDrag: 0.98,
                            },
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'spikeLauncherBarrel2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -30, y: -30},
                            {x: 30, y: -30},
                            {x: 10, y: 0},
                            {x: -10, y: 0},
                        ],
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: -40,
                            reload: {c: 0, t: 120},
                            delay: {c: 10, t: 10},
                            spread: Math.PI/24,
                            bullet: {
                                type: 'polygon',
                                cType: 'point',  
                                size: [
                                    {x: 0, y: 5*4},
                                    {x: -1.299*4, y: 0.75*4},
                                    {x: -4.330*4, y: -2.5*4},
                                    {x: 0, y: -1.5*4},
                                    {x: 4.330*4, y: -2.5*4},
                                    {x: 1.299*4, y: 0.75*4}
                                ],
                                style: {
                                    fill: {r: 255, g: 100, b: 50, a: 1},
                                    stroke: {colour: {r: 255, g: 0, b: 0, a: 1}, width: 3},
                                },
                                decay: {
                                    life: 1500, 
                                    fillStyle: {r: -0.01, g: 0, b: 0, a: 0}, 
                                    strokeStyle: {r: -0.01, g: 0, b: 0, a: 0}, 
                                    size: 1.0005
                                },
                                dmg: 1000,
                                v: 20,
                                vDrag: 0.97,
                                vr: Math.PI/20,
                                rDrag: 0.98,
                            },
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'spikeLauncherBarrel3',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -30, y: -30},
                            {x: 30, y: -30},
                            {x: 10, y: 0},
                            {x: -10, y: 0},
                        ],
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: -40,
                            reload: {c: 0, t: 120},
                            delay: {c: 15, t: 15},
                            spread: Math.PI/24,
                            bullet: {
                                type: 'polygon',
                                cType: 'point',  
                                size: [
                                    {x: 0, y: 5*4},
                                    {x: -1.299*4, y: 0.75*4},
                                    {x: -4.330*4, y: -2.5*4},
                                    {x: 0, y: -1.5*4},
                                    {x: 4.330*4, y: -2.5*4},
                                    {x: 1.299*4, y: 0.75*4}
                                ],
                                style: {
                                    fill: {r: 255, g: 100, b: 50, a: 1},
                                    stroke: {colour: {r: 255, g: 0, b: 0, a: 1}, width: 3},
                                },
                                decay: {
                                    life: 1500, 
                                    fillStyle: {r: -0.01, g: 0, b: 0, a: 0}, 
                                    strokeStyle: {r: -0.01, g: 0, b: 0, a: 0}, 
                                    size: 1.0005
                                },
                                dmg: 1000,
                                v: 20,
                                vDrag: 0.97,
                                vr: Math.PI/20,
                                rDrag: 0.98,
                            },
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'spikeLauncherBarrel4',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -30, y: -30},
                            {x: 30, y: -30},
                            {x: 10, y: 0},
                            {x: -10, y: 0},
                        ],
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: -40,
                            reload: {c: 0, t: 120},
                            delay: {c: 20, t: 20},
                            spread: Math.PI/24,
                            bullet: {
                                type: 'polygon',
                                cType: 'point',  
                                size: [
                                    {x: 0, y: 5*4},
                                    {x: -1.299*4, y: 0.75*4},
                                    {x: -4.330*4, y: -2.5*4},
                                    {x: 0, y: -1.5*4},
                                    {x: 4.330*4, y: -2.5*4},
                                    {x: 1.299*4, y: 0.75*4}
                                ],
                                style: {
                                    fill: {r: 255, g: 100, b: 50, a: 1},
                                    stroke: {colour: {r: 255, g: 0, b: 0, a: 1}, width: 3},
                                },
                                decay: {
                                    life: 1500, 
                                    fillStyle: {r: -0.01, g: 0, b: 0, a: 0}, 
                                    strokeStyle: {r: -0.01, g: 0, b: 0, a: 0}, 
                                    size: 1.0005
                                },
                                dmg: 1000,
                                v: 20,
                                vDrag: 0.97,
                                vr: Math.PI/20,
                                rDrag: 0.98,
                            },
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'spikeLauncherBarrel5',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -30, y: -30},
                            {x: 30, y: -30},
                            {x: 10, y: 0},
                            {x: -10, y: 0},
                        ],
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: -40,
                            reload: {c: 0, t: 120},
                            delay: {c: 25, t: 25},
                            spread: Math.PI/24,
                            bullet: {
                                type: 'polygon',
                                cType: 'point',  
                                size: [
                                    {x: 0, y: 5*4},
                                    {x: -1.299*4, y: 0.75*4},
                                    {x: -4.330*4, y: -2.5*4},
                                    {x: 0, y: -1.5*4},
                                    {x: 4.330*4, y: -2.5*4},
                                    {x: 1.299*4, y: 0.75*4}
                                ],
                                style: {
                                    fill: {r: 255, g: 100, b: 50, a: 1},
                                    stroke: {colour: {r: 255, g: 0, b: 0, a: 1}, width: 3},
                                },
                                decay: {
                                    life: 1500, 
                                    fillStyle: {r: -0.01, g: 0, b: 0, a: 0}, 
                                    strokeStyle: {r: -0.01, g: 0, b: 0, a: 0}, 
                                    size: 1.0005
                                },
                                dmg: 1000,
                                v: 20,
                                vDrag: 0.97,
                                vr: Math.PI/20,
                                rDrag: 0.98,
                            },
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    }
                ],
            },
            Blaster: {
                id: 'blaster',
                facing: 'turret',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -30, y: -30},
                    {x: 30, y: -30},
                    {x: 10, y: 0},
                    {x: -10, y: 0},
                ],
                offset: {x: 0, y: -70},
                style: {
                    fill: 'rgba(150, 150, 150, 1)',
                    stroke: {colour: '#696969', width: 5},
                },
                cannon: {
                    keybind: 'click',
                    x: 0,
                    y: -40,
                    reload: {c: 15, t: 2},
                    spread: Math.PI/100,
                    bullet: {
                        type: 'circle', 
                        size: 5,
                        style: {
                            fill: {r: 20, g: 150, b: 150, a: 1},
                            stroke: {colour: {r: 0, g: 250, b: 250, a: 1}, width: 3},
                        },
                        decay: {
                            life: 100, 
                            fillStyle: {r: -0.1, g: -0.1, b: -0.1, a: 0}, 
                            strokeStyle: {r: -0.1, g: -0.1, b: -0.1, a: 0}, 
                            size: 1.0005
                        },
                        dmg: 20,
                        v: 20,
                        vDrag: 0.97,
                        vr: Math.PI/20,
                        rDrag: 0.98,
                    },
                },
                collision: false,
                hp: 1,
                maxHp: 1,
                isHit: 0,
                connected: [],
            },
            EnergySword: {
                id: 'energySword',
                facing: 'turret',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -25, y: 25},
                    {x: 25, y: 25},
                    {x: 20, y: 0},
                    {x: -20, y: 0},
                ],
                offset: {x: 0, y: -70},
                style: {
                    fill: 'rgba(150, 150, 150, 1)',
                    stroke: {colour: '#696969', width: 5},
                },
                cannon: {
                    keybind: 'click',
                    x: 0,
                    y: 25,
                    reload: {c: 1, t: 0},
                    spread: 0,
                    bullet: {
                        type: 'polygon', 
                        cType: 'line', 
                        cSize: {start: {x: 0, y: 0}, end: {x: 0, y: 250}}, 
                        size: [
                            {x: -25, y: 0},
                            {x: -15, y: 15},
                            {x: -15, y: 30},
                            {x: -20, y: 35},
                            {x: -25, y: 200},
                            {x: 0, y: 250},
                            {x: 25, y: 200},
                            {x: 20, y: 35},
                            {x: 15, y: 30},
                            {x: 15, y: 15},
                            {x: 25, y: 0},
                        ],
                        style: {
                            fill: {r: 50, g: 200, b: 255, a: 0.5},
                            stroke: {colour: {r: 50, g: 200, b: 255, a: 0.7}, width: 5},
                        },
                        decay: {
                            life: 2, 
                            fillStyle: {r: 0, g: 0, b: 0, a: -0.05}, 
                            strokeStyle: {r: 0, g: 0, b: 0, a: -0.05}, 
                            size: 1
                        },
                        accel: true,
                        dmg: 125,
                        v: -3,
                        vDrag: 1,
                        vr: 0,
                        rDrag: 1,
                    },
                },
                collision: false,
                hp: 1,
                maxHp: 1,
                isHit: 0,
                connected: [],
            },
            EnergySpear: {
                id: 'energySword',
                facing: 'turret',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -25, y: 25},
                    {x: 25, y: 25},
                    {x: 20, y: 0},
                    {x: -20, y: 0},
                ],
                offset: {x: 0, y: -70},
                style: {
                    fill: 'rgba(150, 150, 150, 1)',
                    stroke: {colour: '#696969', width: 5},
                },
                collision: false,
                hp: 1,
                maxHp: 1,
                isHit: 0,
                connected: [
                    {
                        id: 'energySpearTip',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: Math.PI,
                        size: 0,
                        offset: {x: 0, y: -400},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(150, 150, 150, 0)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 25,
                            reload: {c: 1, t: 0},
                            spread: 0,
                            bullet: {
                                type: 'polygon', 
                                size: [
                                    {x: -25*0.75, y: 0},
                                    {x: -15*0.75, y: 15*0.75},
                                    {x: -15*0.75, y: 30*0.75},
                                    {x: -20*0.75, y: 35*0.75},
                                    {x: -25*0.75, y: 200*0.75},
                                    {x: 0, y: 250*0.75},
                                    {x: 25*0.75, y: 200*0.75},
                                    {x: 20*0.75, y: 35*0.75},
                                    {x: 15*0.75, y: 30*0.75},
                                    {x: 15*0.75, y: 15*0.75},
                                    {x: 25*0.75, y: 0},
                                ],
                                style: {
                                    fill: {r: 50, g: 200, b: 255, a: 0.5},
                                    stroke: {colour: {r: 50, g: 200, b: 255, a: 0.7}, width: 5},
                                },
                                decay: {
                                    life: 5, 
                                    fillStyle: {r: 0, g: 0, b: 0, a: -0.05}, 
                                    strokeStyle: {r: 0, g: 0, b: 0, a: -0.05}, 
                                    size: 1
                                },
                                dmg: 75,
                                v: -5,
                                vDrag: 1,
                                vr: 0,
                                rDrag: 1,
                            },
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'energySpearHandle',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: Math.PI,
                        size: 0,
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(150, 150, 150, 0)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 25,
                            reload: {c: 1, t: 0},
                            spread: 0,
                            bullet: {
                                type: 'polygon', 
                                size: [
                                    {x: -5, y: 0},
                                    {x: 5, y: 0},
                                    {x: 5, y: 380},
                                    {x: -5, y: 380},
                                ],
                                style: {
                                    fill: {r: 50, g: 200, b: 255, a: 0.5},
                                    stroke: {colour: {r: 50, g: 200, b: 255, a: 0.7}, width: 5},
                                },
                                decay: {
                                    life: 2, 
                                    fillStyle: {r: 0, g: 0, b: 0, a: -0.05}, 
                                    strokeStyle: {r: 0, g: 0, b: 0, a: -0.05}, 
                                    size: 1
                                },
                                dmg: 1,
                                v: 0,
                                vDrag: 1,
                                vr: 0,
                                rDrag: 1,
                            },
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                ],
            },
            Cannon: {
                id: 'tankCannon',
                facing: 'turret',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -10, y: 0},
                    {x: 10, y: 0},
                    {x: 10, y: 30},
                    {x: -10, y: 30},
                ],
                offset: {x: 0, y: -100},
                style: {
                    fill: 'rgba(150, 150, 150, 1)',
                    stroke: {colour: '#696969', width: 10},
                },
                cannon: {
                    keybind: 'click',
                    x: 0,
                    y: 0,
                    reload: {c: 6, t: 12},
                    spread: Math.PI/48/4,
                    bullet: {
                        type: 'circle', 
                        cType: 'point', 
                        size: 8,
                        style: {
                            fill: {r: 100, g: 100, b: 100, a: 1},
                            stroke: {colour: {r: 69, g: 69, b: 69, a: 1}, width: 3},
                        },
                        decay: {
                            life: 120, 
                            fillStyle: {r: 0, g: 0, b: 0, a: 0}, 
                            strokeStyle: {r: 0, g: 0, b: 0, a: 0}, 
                            size: 1
                        },
                        dmg: 120,
                        v: 20,
                        vDrag: 0.99,
                        vr: 0,
                        rDrag: 0,
                        friendly: true,
                    },
                },
                collision: false,
                hp: 1,
                maxHp: 1,
                isHit: 0,
                connected: [],
            },
            OldSniper: {
                id: 'defaultSniper',
                facing: 'turret',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -10, y: 0},
                    {x: 10, y: 0},
                    {x: 10, y: 120},
                    {x: -10, y: 120},
                ],
                offset: {x: 0, y: -190},
                style: {
                    fill: 'rgba(150, 150, 150, 1)',
                    stroke: {colour: '#696969', width: 5},
                },
                cannon: {
                    keybind: 'click',
                    x: 0,
                    y: 0,
                    reload: {c: 45, t: 90},
                    spread: Math.PI/480,
                    bullet: {
                        type: 'polygon', 
                        cType: 'point', 
                        size: [
                            {x: -8, y: 5},
                            {x: 0, y: -20},
                            {x: 8, y: 5},
                        ],
                        style: {
                            fill: {r: 255, g: 100, b: 100, a: 1},
                            stroke: {colour: {r: 255, g: 69, b: 69, a: 1}, width: 3},
                        },
                        decay: {
                            life: 180, 
                            fillStyle: {r: 0, g: 0, b: 0, a: 0}, 
                            strokeStyle: {r: 0, g: 0, b: 0, a: 0}, 
                            size: 1
                        },
                        dmg: 750,
                        v: 30,
                        maxV: 30,
                        vDrag: 1,
                        vr: 0,
                        rDrag: 0,
                        friendly: true,
                    },
                },
                collision: false,
                hp: 1,
                maxHp: 1,
                isHit: 0,
                connected: [],
            },
            Sniper: {
                id: 'Armour Piercing Sniper',
                facing: 'turret',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -8, y: 0},
                    {x: 8, y: 0},
                    {x: 8, y: 200},
                    {x: -8, y: 200},
                ],
                offset: {x: 0, y: -270},
                style: {
                    fill: 'rgba(150, 150, 150, 1)',
                    stroke: {colour: '#696969', width: 5},
                },
                cannon: {
                    keybind: 'click',
                    x: 0,
                    y: 0,
                    reload: {c: 30, t: 90},
                    spread: 0,
                    bullet: {
                        type: 'polygon', 
                        cType: 'line', 
                        cSize: {start: {x: 0, y: 5}, end: {x: 0, y: -20}}, 
                        size: [
                            {x: -8, y: 5},
                            {x: 0, y: -20},
                            {x: 8, y: 5},
                        ],
                        style: {
                            fill: {r: 255, g: 150, b: 100, a: 1},
                            stroke: {colour: {r: 230, g: 135, b: 90, a: 1}, width: 3},
                        },
                        decay: {
                            life: 180, 
                            fillStyle: {r: -0.25, g: -0.15, b: -0.1, a: 0}, 
                            strokeStyle: {r: -0.25, g: -0.15, b: -0.1, a: 0}, 
                            size: 0.995
                        },
                        dmg: 4000,
                        v: 55,
                        maxV: 55,
                        vDrag: 1,
                        vr: 0,
                        rDrag: 0,
                        friendly: true,
                    },
                },
                collision: false,
                hp: 1,
                maxHp: 1,
                isHit: 0,
                connected: [
                    {
                        id: 'laser1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 2, y: -100},
                            {x: 2, y: 0},
                            {x: 0, y: 0},
                            {x: 0, y: -100},
                        ],
                        offset: {x: 25, y: -180},
                        style: {
                            fill: 'rgba(0, 0, 0, 0)',
                            stroke: {colour: 'rgba(255, 0, 0, 0.2)', width: 5},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'laser2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 2, y: -200},
                            {x: 2, y: 0},
                            {x: 0, y: 0},
                            {x: 0, y: -200},
                        ],
                        offset: {x: 25, y: -180},
                        style: {
                            fill: 'rgba(0, 0, 0, 0)',
                            stroke: {colour: 'rgba(255, 0, 0, 0.2)', width: 5},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'laser3',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 2, y: -300},
                            {x: 2, y: 0},
                            {x: 0, y: 0},
                            {x: 0, y: -300},
                        ],
                        offset: {x: 25, y: -180},
                        style: {
                            fill: 'rgba(0, 0, 0, 0)',
                            stroke: {colour: 'rgba(255, 0, 0, 0.2)', width: 5},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'Scope holder',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 8, y: 20},
                            {x: 25, y: 20},
                            {x: 25, y: 0},
                            {x: 8, y: 0},
                        ],
                        offset: {x: 0, y: -170},
                        style: {
                            fill: 'rgba(90, 90, 90, 1)',
                            stroke: {colour: '#696969', width: 2},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'Deco',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -3, y: 140},
                            {x: -3, y: 0},
                            {x: 3, y: 0},
                            {x: 3, y: 140},
                        ],
                        offset: {x: -10, y: -230},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: '#696969', width: 2},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'Muzzle',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -13, y: -230},
                            {x: 13, y: -230},
                            {x: 13, y: -200},
                            {x: -13, y: -200},
                        ],
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'Body',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -12, y: 0},
                            {x: 12, y: 0},
                            {x: 12, y: 30},
                            {x: -12, y: 30},
                        ],
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(120, 120, 120, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'Scope',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -5, y: 0},
                            {x: 5, y: 0},
                            {x: 5, y: -40},
                            {x: -5, y: -40},
                        ],
                        offset: {x: 25, y: -140},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'Scope deco1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 5, y: -10},
                            {x: -5, y: -10},
                        ],
                        offset: {x: 25, y: -130},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'Scope deco2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -5, y: 0},
                            {x: 5, y: 0},
                            {x: 8, y: -10},
                            {x: -8, y: -10},
                        ],
                        offset: {x: 25, y: -180},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'ammo',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 0, y: 35},
                            {x: -25, y: 35},
                            {x: -20, y: 0},
                            {x: 0, y: 0},
                        ],
                        offset: {x: -12, y: -220},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    }
                ],
            },
            SemiAutoSniper: {
                id: 'Semi Auto Sniper',
                facing: 'turret',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -8, y: 0},
                    {x: 8, y: 0},
                    {x: 8, y: 150},
                    {x: -8, y: 150},
                ],
                offset: {x: 0, y: -220},
                style: {
                    fill: 'rgba(150, 150, 150, 1)',
                    stroke: {colour: '#696969', width: 5},
                },
                cannon: {
                    keybind: 'click',
                    x: 0,
                    y: 0,
                    reload: {c: 20, t: 45},
                    spread: 0,
                    bullet: {
                        type: 'polygon', 
                        cType: 'line', 
                        cSize: {start: {x: 0, y: 5}, end: {x: 0, y: -20}}, 
                        size: [
                            {x: -8, y: 5},
                            {x: 0, y: -20},
                            {x: 8, y: 5},
                        ],
                        style: {
                            fill: {r: 255, g: 150, b: 100, a: 1},
                            stroke: {colour: {r: 230, g: 135, b: 90, a: 1}, width: 3},
                        },
                        decay: {
                            life: 180, 
                            fillStyle: {r: -0.25, g: -0.15, b: -0.1, a: 0}, 
                            strokeStyle: {r: -0.25, g: -0.15, b: -0.1, a: 0}, 
                            size: 0.995
                        },
                        dmg: 2750,
                        v: 50,
                        maxV: 50,
                        vDrag: 1,
                        vr: 0,
                        rDrag: 0,
                        friendly: true,
                    },
                },
                collision: false,
                hp: 1,
                maxHp: 1,
                isHit: 0,
                connected: [
                    {
                        id: 'laser1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 2, y: -100},
                            {x: 2, y: 0},
                            {x: 0, y: 0},
                            {x: 0, y: -100},
                        ],
                        offset: {x: 25, y: -180},
                        style: {
                            fill: 'rgba(0, 0, 0, 0)',
                            stroke: {colour: 'rgba(255, 0, 0, 0.2)', width: 5},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'laser2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 2, y: -200},
                            {x: 2, y: 0},
                            {x: 0, y: 0},
                            {x: 0, y: -200},
                        ],
                        offset: {x: 25, y: -180},
                        style: {
                            fill: 'rgba(0, 0, 0, 0)',
                            stroke: {colour: 'rgba(255, 0, 0, 0.2)', width: 5},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'laser3',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 2, y: -300},
                            {x: 2, y: 0},
                            {x: 0, y: 0},
                            {x: 0, y: -300},
                        ],
                        offset: {x: 25, y: -180},
                        style: {
                            fill: 'rgba(0, 0, 0, 0)',
                            stroke: {colour: 'rgba(255, 0, 0, 0.2)', width: 5},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'Scope holder',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 8, y: 20},
                            {x: 25, y: 20},
                            {x: 25, y: 0},
                            {x: 8, y: 0},
                        ],
                        offset: {x: 0, y: -170},
                        style: {
                            fill: 'rgba(90, 90, 90, 1)',
                            stroke: {colour: '#696969', width: 2},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'Deco',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -3, y: 100},
                            {x: -3, y: 0},
                            {x: 3, y: 0},
                            {x: 3, y: 100},
                        ],
                        offset: {x: -10, y: -190},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: '#696969', width: 2},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'Muzzle',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -13, y: -180},
                            {x: 13, y: -180},
                            {x: 13, y: -150},
                            {x: -13, y: -150},
                        ],
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'Body',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -12, y: 0},
                            {x: 12, y: 0},
                            {x: 12, y: 30},
                            {x: -12, y: 30},
                        ],
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(120, 120, 120, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'Scope',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -5, y: 0},
                            {x: 5, y: 0},
                            {x: 5, y: -40},
                            {x: -5, y: -40},
                        ],
                        offset: {x: 25, y: -140},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'Scope deco1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 5, y: -10},
                            {x: -5, y: -10},
                        ],
                        offset: {x: 25, y: -130},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'Scope deco2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -5, y: 0},
                            {x: 5, y: 0},
                            {x: 8, y: -10},
                            {x: -8, y: -10},
                        ],
                        offset: {x: 25, y: -180},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'ammo',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 0, y: 35},
                            {x: -25, y: 35},
                            {x: -20, y: 0},
                            {x: 0, y: 0},
                        ],
                        offset: {x: -15, y: -180},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    }
                ],
            },
            RPG: {
                id: 'rpg',
                facing: 'turret',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -22, y: 0},
                    {x: 22, y: 0},
                    {x: 15, y: 50},
                    {x: -15, y: 50},
                ],
                offset: {x: 40, y: -150},
                style: {
                    fill: 'rgba(130, 130, 130, 1)',
                    stroke: {colour: '#696969', width: 5},
                },
                cannon: {
                    keybind: 'click',
                    x: 0,
                    y: 0,
                    reload: {c: 180, t: 150},
                    spread: Math.PI/480,
                    bullet: {
                        type: 'polygon', 
                        cType: 'point', 
                        size: [
                            {x: -8*2.5, y: -10*2.5},
                            {x: 0, y: -20*2.5},
                            {x: 8*2.5, y: -10*2.5},
                            {x: 3*2.5, y: 5*2.5},
                            {x: 3*2.5, y: 7*2.5},
                            {x: 5*2.5, y: 10*2.5},
                            {x: -5*2.5, y: 10*2.5},
                            {x: -3*2.5, y: 7*2.5},
                            {x: -3*2.5, y: 5*2.5},
                        ],
                        style: {
                            fill: {r: 75*1.5, g: 83*1.5, b: 32*1.5, a: 1},
                            stroke: {colour: {r: 67.5*1.2, g: 74.7*1.2, b: 28.8*1.2, a: 1}, width: 5},
                        },
                        decay: {
                            life: 180, 
                            fillStyle: {r: 0, g: 0, b: 0, a: 0}, 
                            strokeStyle: {r: 0, g: 0, b: 0, a: 0}, 
                            size: 1
                        },
                        dmg: 150,
                        explosion: {
                            dmg: 75, // damage/tick in the explosion radius
                            maxR: 100,
                            expandSpeed: 5,
                            r:20,
                        },
                        v: 2,
                        vDrag: 1.075,
                        accel: true,
                        vr: 0,
                        rDrag: 0,
                        friendly: true,
                    },
                },
                collision: false,
                hp: 1,
                maxHp: 1,
                isHit: 0,
                connected: [
                    {
                        id: 'rpg',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -15, y: 120},
                            {x: 15, y: 120},
                            {x: 15, y: 300},
                            {x: -15, y: 300},
                        ],
                        offset: {x: 40, y: -220},
                        style: {
                            fill: 'rgba(130, 130, 130, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    }
                ],
            },
            Nuker: {
                id: 'nukeLauncher',
                facing: 'turret',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -22, y: 0},
                    {x: 22, y: 0},
                    {x: 15, y: 50},
                    {x: -15, y: 50},
                ],
                offset: {x: 40, y: -150},
                style: {
                    fill: 'rgba(130, 130, 130, 1)',
                    stroke: {colour: '#696969', width: 5},
                },
                cannon: {
                    keybind: 'click',
                    x: 0,
                    y: 0,
                    reload: {c: 180, t: 120},
                    spread: Math.PI/480,
                    bullet: {
                        type: 'polygon', 
                        cType: 'point', 
                        size: [
                            {x: -8*2.5, y: -10*2.5},
                            {x: 0, y: -20*2.5},
                            {x: 8*2.5, y: -10*2.5},
                            {x: 3*2.5, y: 5*2.5},
                            {x: 3*2.5, y: 7*2.5},
                            {x: 5*2.5, y: 10*2.5},
                            {x: -5*2.5, y: 10*2.5},
                            {x: -3*2.5, y: 7*2.5},
                            {x: -3*2.5, y: 5*2.5},
                        ],
                        style: {
                            fill: {r: 75*1.5, g: 83*1.5, b: 32*1.5, a: 1},
                            stroke: {colour: {r: 67.5*1.2, g: 74.7*1.2, b: 28.8*1.2, a: 1}, width: 5},
                        },
                        decay: {
                            life: 180, 
                            fillStyle: {r: 0, g: 0, b: 0, a: 0}, 
                            strokeStyle: {r: 0, g: 0, b: 0, a: 0}, 
                            size: 1
                        },
                        dmg: 100,
                        explosion: {
                            dmg: 1000, // damage/tick in the explosion radius
                            maxR: 10000,
                            expandSpeed: 25,
                            r:20,
                        },
                        v: 5,
                        vDrag: 1.1,
                        accel: true,
                        vr: 0,
                        rDrag: 0,
                        friendly: true,
                    },
                },
                collision: false,
                hp: 1,
                maxHp: 1,
                isHit: 0,
                connected: [
                    {
                        id: 'rpg',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -15, y: 120},
                            {x: 15, y: 120},
                            {x: 15, y: 300},
                            {x: -15, y: 300},
                        ],
                        offset: {x: 40, y: -220},
                        style: {
                            fill: 'rgba(130, 130, 130, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    }
                ],
            },
            DualRPG: {
                id: 'rpgContainer',
                facing: 'body',
                type: 'circle', 
                rOffset: 0,
                size: 0,
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(0, 0, 0, 0)',
                    stroke: {colour: 'rgba(0, 0, 0, 0)', width: 1},
                },
                collision: false,
                hp: 1,
                maxHp: 1,
                isHit: 0,
                connected: [
                    {
                        id: 'rpg',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -22, y: 0},
                            {x: 22, y: 0},
                            {x: 15, y: 50},
                            {x: -15, y: 50},
                        ],
                        offset: {x: 40, y: -150},
                        style: {
                            fill: 'rgba(130, 130, 130, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 180, t: 150},
                            spread: Math.PI/480,
                            bullet: {
                                type: 'polygon', 
                                cType: 'point', 
                                size: [
                                    {x: -8*2.5, y: -10*2.5},
                                    {x: 0, y: -20*2.5},
                                    {x: 8*2.5, y: -10*2.5},
                                    {x: 3*2.5, y: 5*2.5},
                                    {x: 3*2.5, y: 7*2.5},
                                    {x: 5*2.5, y: 10*2.5},
                                    {x: -5*2.5, y: 10*2.5},
                                    {x: -3*2.5, y: 7*2.5},
                                    {x: -3*2.5, y: 5*2.5},
                                ],
                                style: {
                                    fill: {r: 75*1.5, g: 83*1.5, b: 32*1.5, a: 1},
                                    stroke: {colour: {r: 67.5*1.2, g: 74.7*1.2, b: 28.8*1.2, a: 1}, width: 5},
                                },
                                decay: {
                                    life: 180, 
                                    fillStyle: {r: 0, g: 0, b: 0, a: 0}, 
                                    strokeStyle: {r: 0, g: 0, b: 0, a: 0}, 
                                    size: 1
                                },
                                dmg: 150,
                                explosion: {
                                    dmg: 75, // damage/tick in the explosion radius
                                    maxR: 100,
                                    expandSpeed: 5,
                                    r:20,
                                },
                                v: 2,
                                vDrag: 1.075,
                                accel: true,
                                vr: 0,
                                rDrag: 0,
                                friendly: true,
                            },
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [
                            {
                                id: 'rpg',
                                facing: 'turret',
                                type: 'polygon', 
                                rOffset: 0,
                                size: [
                                    {x: -15, y: 120},
                                    {x: 15, y: 120},
                                    {x: 15, y: 300},
                                    {x: -15, y: 300},
                                ],
                                offset: {x: 40, y: -220},
                                style: {
                                    fill: 'rgba(130, 130, 130, 1)',
                                    stroke: {colour: '#696969', width: 5},
                                },
                                collision: false,
                                hp: 1,
                                maxHp: 1,
                                isHit: 0,
                                connected: [],
                            }
                        ],
                    },
                    {
                        id: 'rpg',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -22, y: 0},
                            {x: 22, y: 0},
                            {x: 15, y: 50},
                            {x: -15, y: 50},
                        ],
                        offset: {x: -40, y: -150},
                        style: {
                            fill: 'rgba(130, 130, 130, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 180, t: 150},
                            delay: {c: 75, t: 75},
                            spread: Math.PI/480,
                            bullet: {
                                type: 'polygon', 
                                cType: 'point', 
                                size: [
                                    {x: -8*2.5, y: -10*2.5},
                                    {x: 0, y: -20*2.5},
                                    {x: 8*2.5, y: -10*2.5},
                                    {x: 3*2.5, y: 5*2.5},
                                    {x: 3*2.5, y: 7*2.5},
                                    {x: 5*2.5, y: 10*2.5},
                                    {x: -5*2.5, y: 10*2.5},
                                    {x: -3*2.5, y: 7*2.5},
                                    {x: -3*2.5, y: 5*2.5},
                                ],
                                style: {
                                    fill: {r: 75*1.5, g: 83*1.5, b: 32*1.5, a: 1},
                                    stroke: {colour: {r: 67.5*1.2, g: 74.7*1.2, b: 28.8*1.2, a: 1}, width: 5},
                                },
                                decay: {
                                    life: 180, 
                                    fillStyle: {r: 0, g: 0, b: 0, a: 0}, 
                                    strokeStyle: {r: 0, g: 0, b: 0, a: 0}, 
                                    size: 1
                                },
                                dmg: 150,
                                explosion: {
                                    dmg: 75, // damage/tick in the explosion radius
                                    maxR: 100,
                                    expandSpeed: 5,
                                    r:20,
                                },
                                v: 2,
                                vDrag: 1.075,
                                accel: true,
                                vr: 0,
                                rDrag: 0,
                                friendly: true,
                            },
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [
                            {
                                id: 'rpg',
                                facing: 'turret',
                                type: 'polygon', 
                                rOffset: 0,
                                size: [
                                    {x: -15, y: 120},
                                    {x: 15, y: 120},
                                    {x: 15, y: 300},
                                    {x: -15, y: 300},
                                ],
                                offset: {x: -40, y: -220},
                                style: {
                                    fill: 'rgba(130, 130, 130, 1)',
                                    stroke: {colour: '#696969', width: 5},
                                },
                                collision: false,
                                hp: 1,
                                maxHp: 1,
                                isHit: 0,
                                connected: [],
                            }
                        ],
                    },
                ],
            },
            ShieldProjector: {
                id: 'smallShieldBase',
                facing: 'turret',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -30, y: 0},
                    {x: -30, y: 30},
                    {x: -20, y: 40},
                    {x: 20, y: 40},
                    {x: 30, y: 30},
                    {x: 30, y: 0},
                ],
                offset: {x: 0, y: 25},
                style: {
                    fill: 'rgba(150, 150, 150, 1)',
                    stroke: {colour: '#696969', width: 5},
                },
                collision: true,
                hp: 1000,
                maxHp: 1000,
                isHit: 0,
                connected: [
                    {
                        id: 'smallShieldProjector',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 15,
                        offset: {x: 0, y: 45},
                        style: {
                            fill: 'rgba(0, 255, 255, 0.9)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        shield: {
                            keybind: 'q',
                            type: 'circle', 
                            r: 160,
                            hp: 4000,
                            regen: 3,
                            minHp: 1500,
                            active: false,
                            cap: 4000,
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                ],
            },
            LargeShieldProjector: {
                id: 'mediumShieldBase',
                facing: 'turret',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -30*1.5, y: 0},
                    {x: -30*1.5, y: 30*1.5},
                    {x: -20*1.5, y: 40*1.5},
                    {x: 20*1.5, y: 40*1.5},
                    {x: 30*1.5, y: 30*1.5},
                    {x: 30*1.5, y: 0},
                ],
                offset: {x: 0, y: 25},
                style: {
                    fill: 'rgba(150, 150, 150, 1)',
                    stroke: {colour: '#696969', width: 5},
                },
                collision: true,
                hp: 2000,
                maxHp: 2000,
                isHit: 0,
                connected: [
                    {
                        id: 'mediumShieldProjector',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 25,
                        offset: {x: 0, y: 45},
                        style: {
                            fill: 'rgba(0, 255, 255, 0.9)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        shield: {
                            keybind: 'q',
                            type: 'circle', 
                            r: 250,
                            hp: 12000,
                            regen: 10,
                            minHp: 5000,
                            active: false,
                            cap: 12000,
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                ],
            },
            SuperShieldProjector: {
                id: 'superShieldBase',
                facing: 'turret',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -30*1.5, y: 0},
                    {x: -30*1.5, y: 30*1.5},
                    {x: -20*1.5, y: 40*1.5},
                    {x: 20*1.5, y: 40*1.5},
                    {x: 30*1.5, y: 30*1.5},
                    {x: 30*1.5, y: 0},
                ],
                offset: {x: 0, y: 25},
                style: {
                    fill: 'rgba(150, 150, 150, 1)',
                    stroke: {colour: '#696969', width: 5},
                },
                collision: true,
                hp: 2500,
                maxHp: 2500,
                isHit: 0,
                connected: [
                    {
                        id: 'superShieldProjector',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 25,
                        offset: {x: 0, y: 45},
                        style: {
                            fill: 'rgba(0, 255, 255, 0.9)',
                            stroke: {colour: '#696969', width: 5},
                        },
                        shield: {
                            keybind: 'q',
                            type: 'circle', 
                            r: 250,
                            hp: 50000,
                            regen: 50,
                            minHp: 10000,
                            active: false,
                            cap: 50000,
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                ],
            },
            Railgun: {
                id: 'raingunContainer',
                facing: 'turret',
                type: 'circle', 
                rOffset: 0,
                size: 0,
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(150, 150, 150, 0)',
                    stroke: {colour: '#696969', width: 2},
                },
                collision: false,
                hp: 1,
                maxHp: 1,
                isHit: 0,
                connected: [
                    {
                        id: 'glow 1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -23+10, y: 0},
                            {x: -18+10, y: 0},
                            {x: -18+10, y: -160},
                            {x: -23+10, y: -160},
                        ],
                        offset: {x: 0, y: -75},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 2,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'glow 2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23-10, y: 0},
                            {x: 18-10, y: 0},
                            {x: 18-10, y: -160},
                            {x: 23-10, y: -160},
                        ],
                        offset: {x: 0, y: -75},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 2,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'bottom guide rail 1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -23+10, y: 0},
                            {x: -18+10, y: 0},
                            {x: -18+10, y: -160},
                            {x: -23+10, y: -160},
                        ],
                        offset: {x: 0, y: -75},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'bottom guide rail 2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23-10, y: 0},
                            {x: 18-10, y: 0},
                            {x: 18-10, y: -160},
                            {x: 23-10, y: -160},
                        ],
                        offset: {x: 0, y: -75},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'deco 0',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 35, y: -20},
                            {x: -35, y: -20},
                            {x: -30, y: 0},
                            {x: 30, y: 0},
                        ],
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'emitter',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -12, y: 20},
                            {x: 12, y: 20},
                            {x: 12, y: 30},
                            {x: -12, y: 30},
                        ],
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 30, t: 120},
                            delay: {c: 20, t: 20},
                            spread: 0,
                            bullet: {
                                type: 'polygon', 
                                cType: 'line', 
                                cSize: {start: {x: 0, y: 0}, end: {x: 0, y: -40}},
                                size: [
                                    {x: -4, y: 0},
                                    {x: 4, y: 0},
                                    {x: 4, y: -8},
                                    {x: 2, y: -10},
                                    {x: 2, y: -35},
                                    {x: 0, y: -40},
                                    {x: -2, y: -35},
                                    {x: -2, y: -10},
                                    {x: -4, y: -8},
                                ],
                                style: {
                                    fill: {r: 50, g: 50, b: 50, a: 1},
                                    stroke: {colour: {r: 10, g: 10, b: 10, a: 1}, width: 1},
                                },
                                decay: {
                                    life: 600, 
                                    fillStyle: {r: 0, g: 0, b: 0, a: 0}, 
                                    strokeStyle: {r: 0, g: 0, b: 0, a: 0}, 
                                    size: 1
                                },
                                dmg: 6000,
                                v: 75,
                                maxV: 75,
                                vDrag: 1,
                                vr: 0,
                                rDrag: 0,
                                friendly: true,
                            },
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'guide rail 1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -25, y: 0},
                            {x: -16, y: 0},
                            {x: -16, y: -180},
                            {x: -25, y: -180},
                        ],
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'guide rail 2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 25, y: 0},
                            {x: 16, y: 0},
                            {x: 16, y: -180},
                            {x: 25, y: -180},
                        ],
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'support1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23, y: 10},
                            {x: -23, y: 10},
                            {x: -23, y: 0},
                            {x: 23, y: 0},
                        ],
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'support2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23, y: 10},
                            {x: -23, y: 10},
                            {x: -23, y: 0},
                            {x: 23, y: 0},
                        ],
                        offset: {x: 0, y: -130},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'support3',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23, y: 10},
                            {x: -23, y: 10},
                            {x: -23, y: 0},
                            {x: 23, y: 0},
                        ],
                        offset: {x: 0, y: -160},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'support4',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23, y: 10},
                            {x: -23, y: 10},
                            {x: -23, y: 0},
                            {x: 23, y: 0},
                        ],
                        offset: {x: 0, y: -190},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'support5',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23, y: 10},
                            {x: -23, y: 10},
                            {x: -23, y: 0},
                            {x: 23, y: 0},
                        ],
                        offset: {x: 0, y: -220},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'deco 1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 4, y: 0},
                            {x: -4, y: 0},
                            {x: -4, y: -120},
                            {x: 4, y: -120},
                        ],
                        offset: {x: -30, y: -90},
                        style: {
                            fill: 'rgba(120, 120, 120, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'deco 2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 4, y: 0},
                            {x: -4, y: 0},
                            {x: -4, y: -120},
                            {x: 4, y: -120},
                        ],
                        offset: {x: 30, y: -90},
                        style: {
                            fill: 'rgba(120, 120, 120, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'arm brace 1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 8, y: -15},
                            {x: -8, y: -15},
                            {x: -5, y: 15},
                            {x: 5, y: 15},
                        ],
                        offset: {x: 20, y: -55},
                        style: {
                            fill: 'rgba(80, 80, 80, 1)',
                            stroke: {colour: 'rgba(40, 40, 40, 1)', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'arm brace 2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 8, y: -15},
                            {x: -8, y: -15},
                            {x: -5, y: 15},
                            {x: 5, y: 15},
                        ],
                        offset: {x: -20, y: -55},
                        style: {
                            fill: 'rgba(80, 80, 80, 1)',
                            stroke: {colour: 'rgba(40, 40, 40, 1)', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                ],
            },
            RailgunMK2: {
                id: 'raingunContainer',
                facing: 'turret',
                type: 'circle', 
                rOffset: 0,
                size: 0,
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(150, 150, 150, 0)',
                    stroke: {colour: '#696969', width: 2},
                },

                collision: false,
                hp: 1,
                maxHp: 1,
                isHit: 0,
                connected: [
                    {
                        id: 'glow 1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -23+10, y: 0},
                            {x: -18+10, y: 0},
                            {x: -18+10, y: -280},
                            {x: -23+10, y: -280},
                        ],
                        offset: {x: 0, y: -75},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 2,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'glow 2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23-10, y: 0},
                            {x: 18-10, y: 0},
                            {x: 18-10, y: -280},
                            {x: 23-10, y: -280},
                        ],
                        offset: {x: 0, y: -75},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 2,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'bottom guide rail 1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -23+10, y: 0},
                            {x: -18+10, y: 0},
                            {x: -18+10, y: -280},
                            {x: -23+10, y: -280},
                        ],
                        offset: {x: 0, y: -75},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'bottom guide rail 2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23-10, y: 0},
                            {x: 18-10, y: 0},
                            {x: 18-10, y: -280},
                            {x: 23-10, y: -280},
                        ],
                        offset: {x: 0, y: -75},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'deco 0',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 35, y: -20},
                            {x: -35, y: -20},
                            {x: -30, y: 0},
                            {x: 30, y: 0},
                        ],
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'emitter',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -12, y: 20},
                            {x: 12, y: 20},
                            {x: 12, y: 30},
                            {x: -12, y: 30},
                        ],
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 10, t: 15},
                            spread: 0,
                            bullet: {
                                type: 'polygon', 
                                cType: 'line', 
                                cSize: {start: {x: 0, y: 0}, end: {x: 0, y: -40}},
                                size: [
                                    {x: -4, y: 0},
                                    {x: 4, y: 0},
                                    {x: 4, y: -8},
                                    {x: 2, y: -10},
                                    {x: 2, y: -35},
                                    {x: 0, y: -40},
                                    {x: -2, y: -35},
                                    {x: -2, y: -10},
                                    {x: -4, y: -8},
                                ],
                                style: {
                                    fill: {r: 50, g: 50, b: 50, a: 1},
                                    stroke: {colour: {r: 10, g: 10, b: 10, a: 1}, width: 1},
                                },
                                decay: {
                                    life: 600, 
                                    fillStyle: {r: 0, g: 0, b: 0, a: 0}, 
                                    strokeStyle: {r: 0, g: 0, b: 0, a: 0}, 
                                    size: 1
                                },
                                dmg: 10000,
                                v: 75,
                                maxV: 75,
                                vDrag: 1,
                                vr: 0,
                                rDrag: 0,
                                friendly: true,
                            },
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'guide rail 1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -25, y: 0},
                            {x: -16, y: 0},
                            {x: -16, y: -300},
                            {x: -25, y: -300},
                        ],
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'guide rail 2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 25, y: 0},
                            {x: 16, y: 0},
                            {x: 16, y: -300},
                            {x: 25, y: -300},
                        ],
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'support1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23, y: 10},
                            {x: -23, y: 10},
                            {x: -23, y: 0},
                            {x: 23, y: 0},
                        ],
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'support2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23, y: 10},
                            {x: -23, y: 10},
                            {x: -23, y: 0},
                            {x: 23, y: 0},
                        ],
                        offset: {x: 0, y: -130},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'support3',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23, y: 10},
                            {x: -23, y: 10},
                            {x: -23, y: 0},
                            {x: 23, y: 0},
                        ],
                        offset: {x: 0, y: -160},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'support4',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23, y: 10},
                            {x: -23, y: 10},
                            {x: -23, y: 0},
                            {x: 23, y: 0},
                        ],
                        offset: {x: 0, y: -190},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'support5',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23, y: 10},
                            {x: -23, y: 10},
                            {x: -23, y: 0},
                            {x: 23, y: 0},
                        ],
                        offset: {x: 0, y: -220},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'support6',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23, y: 10},
                            {x: -23, y: 10},
                            {x: -23, y: 0},
                            {x: 23, y: 0},
                        ],
                        offset: {x: 0, y: -250},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'support7',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23, y: 10},
                            {x: -23, y: 10},
                            {x: -23, y: 0},
                            {x: 23, y: 0},
                        ],
                        offset: {x: 0, y: -280},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'support8',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23, y: 10},
                            {x: -23, y: 10},
                            {x: -23, y: 0},
                            {x: 23, y: 0},
                        ],
                        offset: {x: 0, y: -310},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'support9',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23, y: 10},
                            {x: -23, y: 10},
                            {x: -23, y: 0},
                            {x: 23, y: 0},
                        ],
                        offset: {x: 0, y: -340},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'deco 1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 4, y: 0},
                            {x: -4, y: 0},
                            {x: -4, y: -180},
                            {x: 4, y: -180},
                        ],
                        offset: {x: -30, y: -90},
                        style: {
                            fill: 'rgba(120, 120, 120, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'deco 2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 4, y: 0},
                            {x: -4, y: 0},
                            {x: -4, y: -180},
                            {x: 4, y: -180},
                        ],
                        offset: {x: 30, y: -90},
                        style: {
                            fill: 'rgba(120, 120, 120, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'arm brace 1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 8, y: -15},
                            {x: -8, y: -15},
                            {x: -5, y: 15},
                            {x: 5, y: 15},
                        ],
                        offset: {x: 20, y: -55},
                        style: {
                            fill: 'rgba(80, 80, 80, 1)',
                            stroke: {colour: 'rgba(40, 40, 40, 1)', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                    {
                        id: 'arm brace 2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 8, y: -15},
                            {x: -8, y: -15},
                            {x: -5, y: 15},
                            {x: 5, y: 15},
                        ],
                        offset: {x: -20, y: -55},
                        style: {
                            fill: 'rgba(80, 80, 80, 1)',
                            stroke: {colour: 'rgba(40, 40, 40, 1)', width: 1},
                        },
                        collision: false,
                        hp: 1,
                        maxHp: 1,
                        isHit: 0,
                        connected: [],
                    },
                ],
            },
        },
        obstacles: {
            basicWall: {
                type: 'polygon',
                cType: 'tall',
                size: [
                    {x: -100, y: -100},
                    {x: 100, y: -100},
                    {x: 100, y: 100},
                    {x: -100, y: 100},
                ],
                style: {
                    fill: 'rgba(128, 128, 128, 1)',
                    stroke: {colour: 'rgba(115, 115, 115, 1)', width: 10},
                },
                collisionEdges: [0,1,2,3],
            },
        },
        parts: {
            empty: {
                id: 'placeholder',
                type: 'circle', 
                facing: 'body',
                rOffset: 0,
                size: 0,
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(0, 0, 0, 0)',
                    stroke: {colour: 'rgba(0, 0, 0, 0)', width: 1},
                },
                collision: false,
                hp: 1,
                maxHp: 1,
                isHit: 0,
                connected: [],
            },
        },
    },
    scripts: {
        noAI: `(function() {${noAI}})()`,
        turretAI: `(function() {${advancedTurretAI}})()`,
        sniperAI: `(function() {${sniperTurretAI}})()`,
        tankAI: `(function() {${basicTankAI}})()`,
        targetAI: `(function() {${basicMovingTargetAI}})()`,
        shieldAI: `(function() {${shieldAI}})()`,
    },
    checkpoint: {
        x: 0,
        y: 0,
        collisionR: 100,
        type: 'checkpoint',
        triggered: false,
        parts: [
            {
                id: 'Checkpoint',
                facing: 'body',
                type: 'circle', 
                rOffset: 0,
                size: 100,
                offset: {x: 10, y: 10},
                style: {
                    fill: 'rgba(100, 255, 100, 1)',
                    stroke: {colour: 'rgba(50, 200, 50, 1)', width: 10},
                },
                style2: {
                    fill: 'rgba(80, 204, 80, 1)',
                    stroke: {colour: 'rgba(40, 160, 40, 1)', width: 10},
                },
                connected: [],
            },
        ],
    },
    red: { // SHOULD be compatible with any rendering thing I made (in theory)
        fill: 'rgba(255, 0, 0, 1)',
        stroke: {colour: 'rgba(255, 0, 0, 1)', width: 5, opacity: 1},
    },
    green: { // SHOULD be compatible with any rendering thing I made (in theory)
        fill: 'rgba(0, 255, 0, 1)',
        stroke: {colour: 'rgba(0, 255, 0, 1)', width: 5, opacity: 1},
    },
    blue: { // SHOULD be compatible with any rendering thing I made (in theory)
        fill: 'rgba(0, 0, 255, 1)',
        stroke: {colour: 'rgba(0, 0, 255, 1)', width: 5, opacity: 1},
    },
    black: { // SHOULD be compatible with any rendering thing I made (in theory)
        fill: 'rgba(0, 0, 0, 1)',
        stroke: {colour: 'rgba(0, 0, 0, 1)', width: 5, opacity: 1},
    },
    white: { // SHOULD be compatible with any rendering thing I made (in theory)
        fill: 'rgba(0, 0, 0, 1)',
        stroke: {colour: 'rgba(0, 0, 0, 1)', width: 5, opacity: 1},
    },
};

var teams = [];
var projectiles = [];
var particles = [];
var entities = [];
var obstacles = [];
var explosions = [];
var shields = [];
var checkpoint = JSON.parse(JSON.stringify(data.checkpoint));

// Loading savegames TODO: add saving entire game not just player
var player = {};
//localStorage.removeItem('player');
var savedPlayer = localStorage.getItem('player');
if (savedPlayer !== null) {
    console.log('loading previous save');
    player = JSON.parse(savedPlayer);
    console.log(savedPlayer);
} else {
    // No saved data found
    console.log('no save found, creating new player');
    player = JSON.parse(JSON.stringify(data.mech));
    entities.push(player);
};

// Steal Data (get inputs)
var mousepos = {x:0,y:0};
var display = {x:window.innerWidth, y:window.innerHeight};
//console.log(display);
//console.log(entities);
window.onkeyup = function(e) {
    for (var i = 0; i < entities.length; i++) {
        if (entities[i].directControl) {
            entities[i].keyboard[e.key.toLowerCase()] = false; 
        }
    }
};
window.onkeydown = function(e) {
    for (var i = 0; i < entities.length; i++) {
        if (entities[i].directControl) {
            entities[i].keyboard[e.key.toLowerCase()] = true; 
            if (!paused) {
                e.preventDefault();
            }
        }
    }
};
document.addEventListener('mousedown', function(event) {
    if (event.button === 0) { // Check if left mouse button was clicked
        for (var i = 0; i < entities.length; i++) {
            if (entities[i].directControl) {
                entities[i].keyboard.click = true;
            }
        }
    }
});
document.addEventListener('mouseup', function(event) {
    if (event.button === 0) { // Check if left mouse button was released
        for (var i = 0; i < entities.length; i++) {
            if (entities[i].directControl) {
                entities[i].keyboard.click = false;
            }
        }
    }
});
window.addEventListener("resize", function () {
    if (t > 0) {
        display = {x:window.innerWidth,y:window.innerHeight};
        replacehtml(`<canvas id="main" width="${display.x}" height="${display.y}" style="position: absolute; top: 0; left: 0; z-index: 1;"></canvas><canvas id="canvasOverlay" width="${display.x}" height="${display.y}" style="position: absolute; top: 0; left: 0; z-index: 2;"></canvas>`);
    }
});
function tellPos(p){
    mousepos = {x: p.pageX, y:p.pageY};
};
window.addEventListener('mousemove', tellPos, false);
var buttons = document.getElementsByClassName('button');

// Game related stuff
function load() {
    console.log('Startin the game...');
    replacehtml(`<canvas id="main" width="${display.x}" height="${display.y}" style="position: absolute; top: 0; left: 0; z-index: 1;"></canvas><canvas id="canvasOverlay" width="${display.x}" height="${display.y}" style="position: absolute; top: 0; left: 0; z-index: 2;"></canvas>`);
    game();
};

function loadLevel(level) {
    console.log('Startin the game...');
    replacehtml(`<canvas id="main" width="${display.x}" height="${display.y}" style="position: absolute; top: 0; left: 0; z-index: 1;"></canvas><canvas id="canvasOverlay" width="${display.x}" height="${display.y}" style="position: absolute; top: 0; left: 0; z-index: 2;"></canvas>`);
    eval(`level${level}();`);
    t = 0;
    game();
};

function loadScript(force, n) {
    for (let i=0; i < teams.length; i++) {
        if (teams[i].id == force) {
            if (n == 0) {
                teams[i].script = `(function() {${document.getElementById(`script${n}`).value}})()`; //.replaceAll('\n', '').replaceAll('\t', '')
                console.log(teams[i].script);
            } else {
                teams[i].scripts[`script${n}`] = `(function() {${document.getElementById(`script${n}`).value}})()`; //.replaceAll('\n', '').replaceAll('\t', '')
                console.log(teams[i].scripts);
            }
        }
    }
};

function placeObstacle(objId, r, coords) {
    let obj = JSON.parse(JSON.stringify(data.template.obstacles[objId]));
    obj.size = offsetPoints(rotatePolygon(obj.size, r), coords);
    for (let i = 0; i < obj.size.length; i++) {
        obj.size[i].x = Math.round(obj.size[i].x/10)*10;
        obj.size[i].y = Math.round(obj.size[i].y/10)*10;
    }

    obstacles.push(obj);
    return 0
};

function levelSTTDV1() {
    overlay.style.display = 'none';
    const basicWall = 'basicWall';

    // clear arrays and move checkpoint
    obstacles = [];
    projectiles = [];
    explosions = [];
    particles = [];
    entities = [];
    shields = [];
    teams = [];    
    checkpoint = JSON.parse(JSON.stringify(data.checkpoint));
    checkpoint.x = 0;
    checkpoint.y = 0;

    // place obstacles
    placeObstacle(basicWall, 0, {x: 500, y: 500});

    // Create teams
    let playerForce = JSON.parse(JSON.stringify(data.template.team));
    playerForce.id = 'Player';
    teams.push(playerForce);

    let enemyForce = JSON.parse(JSON.stringify(data.template.team));
    enemyForce.id = 'Enemy';
    enemyForce.scripts.noAI = data.scripts.noAI;
    enemyForce.scripts.turretAI = data.scripts.turretAI;
    enemyForce.scripts.tankAI = data.scripts.tankAI;
    teams.push(enemyForce);

    // Create player
    player = Object.assign({}, JSON.parse(JSON.stringify(data.skibidiToilet)), JSON.parse(JSON.stringify(data.template.memory)));
    player.directControl = true;
    player.team = 'Player';
    player.script = 'script1';
    player.x = 0;
    player.y = 0;
    entities.push(player);

    console.log('Loaded skibidi toilet tower defense V1');
};

function spawnUnit(team, unitType, unitName, script) {
    let unit = Object.assign({}, JSON.parse(JSON.stringify(data[unitType])), JSON.parse(JSON.stringify(data.memory)));
    unit.team = team.id;
    unit.id = unitName;
    unit.x = team.spawn.x;
    unit.y = team.spawn.y;
    unit.script = script;
};

function recursiveAddParts(unit, parts, weapon) {
    for (let i = 0; i < parts.length; i++) {
        if (parts[i].id == weapon.id) {
            parts[i] = weapon;
        }
        parts[i].connected = recursiveAddParts(unit, parts[i].connected, weapon);
    }
    return parts;
};

function recursiveOffset(parts, offset) {
    for (let i = 0; i < parts.length; i++) {
        parts[i].offset = vMath(parts[i].offset, offset, '+');
        parts[i].connected = recursiveOffset(parts[i].connected, offset);
    }
    return parts;
};

function recursiveInvert(parts) {
    for (let i = 0; i < parts.length; i++) {
        parts[i].offset.x *= -1
        parts[i].rOffset *= -1;
        if (parts[i].type == 'polygon') {
            for (let j = 0; j < parts[i].size.length; j++) {
                parts[i].size[j].x *= -1;
            }
        }
        parts[i].connected = recursiveInvert(parts[i].connected);
    }
    return parts;
};

function recursiveModify(parts, facing=undefined, keybind=undefined) {
    for (let i = 0; i < parts.length; i++) {
        if (facing) {
            parts[i].facing = facing;
        }
        if (keybind) {
            if (parts[i].cannon) {
                parts[i].cannon.keybind = keybind;
            }
        }
        parts[i].connected = recursiveModify(parts[i].connected);
    }
    return parts;
};

function addWeapon(unit, weaponID, unitType, slot, keybind='click') {
    let weapon = JSON.parse(JSON.stringify(data.template.weapons[weaponID]));
    let offset = {x: 0, y: 0};
    let invert = false;
    let facing = 'turret';
    switch (unitType) {
        case 'mech':
            switch (slot) {
                case 'rightArmMain':
                    invert = true;
                case 'leftArmMain':
                    if (weaponID == 'RPG') {
                        offset = vMath(offset, {x: -40, y: 0}, '+');
                    }
                    offset = vMath(offset, {x: -100, y: 0}, '+');
                    break;
                case 'rightArmSide':
                    invert = true;
                case 'leftArmSide':
                    //console.log(weaponID+'SideMounted');
                    //console.log(data.template.weapons[weaponID+'SideMounted']);
                    weapon = JSON.parse(JSON.stringify(data.template.weapons[weaponID+'SideMounted']));
                    offset = vMath(offset, {x: -150, y: 0}, '+');
                    break;
                case 'headTurret':
                    break;
                case 'back':
                    offset = vMath(offset, {x: 0, y: 20}, '+');
                    break;
                default:
                    throw `tf is this slot type! ${slot}`;
            }
            break;
        case 'tank':
            switch (slot) {
                case 'main':
                    offset = vMath(offset, {x: 0, y: 0}, '+');
                    if (weaponID.includes('Cannon')) {
                        offset = vMath(offset, {x: 0, y: -70}, '+');
                    }
                    if (weaponID == 'RPG') {
                        offset = {x: -40, y: -150};
                    }
                    break;
                case 'rightSide':
                    invert = true;
                case 'leftSide':
                    weapon = JSON.parse(JSON.stringify(data.template.weapons[weaponID+'SideMounted']));
                    offset = vMath(offset, {x: -140, y: -0}, '+');
                    facing = 'body';
                    break;
                default:
                    throw `tf is this slot type! ${slot}`;
            }
            break;
        case 'staticTurret':
            switch (slot) {
                case 'mainGun':
                    offset = vMath(offset, {x: 0, y: -30}, '+');
                    if (weaponID.includes('Cannon')) {
                        offset = vMath(offset, {x: 0, y: -70}, '+');
                    }
                    if (weaponID == 'RPG') {
                        offset = {x: -40, y: -180};
                    }
                    break;
                default:
                    throw `tf is this slot type! ${slot[0]}`;
            }
            break;
        default:
            throw `ERROR: Unsupported unit type for weapon assignment: ${unitType}!`;
    }
    weapon.facing = facing;
    weapon.keybind = keybind;
    weapon.connected = recursiveModify(weapon.connected, facing, keybind);
    weapon.offset = vMath(weapon.offset, offset, '+');
    weapon.connected = recursiveOffset(weapon.connected, offset);
    weapon.id = slot;
    if (invert) {
        weapon.offset.x *= -1
        if (weapon.type == 'polygon') {
            for (let i = 0; i < weapon.size.length; i++) {
                weapon.size[i].x *= -1;
            }
        }
        weapon.rOffset *= -1;
        weapon.connected = recursiveInvert(weapon.connected);
    }
    unit.parts = recursiveAddParts(unit, unit.parts, weapon);
    //console.log(unit);
    return unit;
};

function handlePlayerMotion(unit, obstacles) {
    //console.log(unit.keyboard);
    if (unit.directControl) {
        unit.aimPos = vMath(vMath(mousepos, unit, '+'), vMath(display, 0.5, '*'), '-');
    }
    if (unit.keyboard.aimPos) {
        unit.aimPos = unit.keyboard.aimPos;
        unit.keyboard.aimPos = undefined;
    }
    unit.mouseR = rotateAngle(unit.mouseR, aim(unit, unit.aimPos), unit.tr);
    unit.lastMoved += 1;
    unit.r = correctAngle(unit.r);
    unit.mouseR = correctAngle(unit.mouseR);
    switch (unit.type) {
        case 'mech':
            unit.vx = 0;
            unit.vy = 0;
            let mechSpeed = unit.v;
            if (unit.keyboard.capslock) {
                mechSpeed *= 1.25;
            }
            if (unit.keyboard.shift) {
                mechSpeed *= 1.25;
            }
            let mechIsMoving = false;
            let mechVector = {x: 0, y: 0}; // special maths
            if (unit.keyboard.w || unit.keyboard.arrowup) { 
                mechVector.y -= 1
                mechIsMoving = true;
            }
            if (unit.keyboard.s || unit.keyboard.arrowdown) {
                mechVector.y += 1
                mechIsMoving = true;
            }
            if (unit.keyboard.a || unit.keyboard.arrowleft) { 
                mechVector.x -= 1
                mechIsMoving = true;
            }
            if (unit.keyboard.d || unit.keyboard.arrowright) { 
                mechVector.x += 1
                mechIsMoving = true;
            }
            //console.log('before', unit.r);
            if (mechIsMoving) {
                if (unit.lastMoved >= 10) {
                    unit.r = aim({x:0, y: 0}, mechVector);
                } else {
                    unit.r = rotateAngle(unit.r, aim({x:0, y: 0}, mechVector), unit.vr);
                }
                unit.r = correctAngle(unit.r);
                let mechVelocity = toComponent(mechSpeed, unit.r);
                unit.x += mechVelocity.x;
                unit.y += mechVelocity.y;
                unit.vx = mechVelocity.x;
                unit.vy = mechVelocity.y;
                unit.lastMoved = -1;
                /* // Old unrealistic collision (use if new version doesn't work)
                if (handleGroundCollisions(unit, obstacles)) {
                    unit.x -= mechVelocity.x;
                    unit.y -= mechVelocity.y;
                    unit.vx = 0;
                    unit.vy = 0;
                }*/
                let res = handleGroundCollisions(unit, obstacles, true, mechVelocity);
                if (res) {
                    unit.x -= mechVelocity.x;
                    unit.y -= mechVelocity.y;
                    if (res != 'well, shit') {
                        let mechWallVector = {x: res.end.x - res.start.x, y: res.end.y - res.start.y};
                        let mechSlideVector = vMath(vMath(mechVelocity, mechWallVector, 'projection'), 0.75, 'multiply');
                        unit.x += mechSlideVector.x;
                        unit.y += mechSlideVector.y;
                        unit.vx = mechSlideVector.x;
                        unit.vy = mechSlideVector.y;
                    }
                }
            }
            //console.log('after', unit.r);
            return unit;
        case 'tank':
            let tankTopSpeed = unit.v;
            unit.r = correctAngle(unit.r);
            if (unit.keyboard.capslock) {
                tankTopSpeed *= 2;
            }
            if (unit.keyboard.shift) {
                tankTopSpeed *= 1.5;
            }
            let tankSpeed = Math.sqrt(unit.vx**2+unit.vy**2);
            if (unit.reverse) {
                tankSpeed = -Math.abs(tankSpeed);
            }
            if (unit.keyboard.w || unit.keyboard.arrowup) { 
                tankSpeed += tankTopSpeed/10;
            }
            if (unit.keyboard.s || unit.keyboard.arrowdown) {
                tankSpeed -= tankTopSpeed/10;
            }
            if (unit.keyboard.a || unit.keyboard.arrowleft) { 
                unit.r = rotateAngle(unit.r, unit.r-unit.vr, unit.vr);
            }
            if (unit.keyboard.d || unit.keyboard.arrowright) { 
                unit.r = rotateAngle(unit.r, unit.r+unit.vr, unit.vr);
            }
            if (tankSpeed < 0) {
                unit.reverse = true;
            } else {
                unit.reverse = false;
            }
            tankSpeed = Math.abs(tankSpeed);
            if (tankSpeed > tankTopSpeed) {
                tankSpeed = Math.max(tankTopSpeed, tankSpeed-0.25*tankTopSpeed);
            }
            if (tankSpeed < -tankTopSpeed*0.75) {
                tankSpeed = Math.min(-tankTopSpeed*0.75, tankSpeed+0.25*tankTopSpeed);
            }
            let tankR = unit.r;
            if (unit.reverse) {
                tankR = correctAngle(unit.r+Math.PI);
            }
            let tankVelocity = toComponent(Math.abs(tankSpeed), tankR);
            unit.x += tankVelocity.x;
            unit.y += tankVelocity.y;
            unit.vx = tankVelocity.x;
            unit.vy = tankVelocity.y;
            let res = handleGroundCollisions(unit, obstacles, true, tankVelocity);
                if (res) {
                    unit.x -= tankVelocity.x;
                    unit.y -= tankVelocity.y;
                    if (res != 'well, shit') {
                        let tankWallVector = {x: res.end.x - res.start.x, y: res.end.y - res.start.y};
                        let tankSlideVector = vMath(vMath(tankVelocity, tankWallVector, 'projection'), 0.9, 'multiply');
                        unit.x += tankSlideVector.x;
                        unit.y += tankSlideVector.y;
                        unit.vx = tankSlideVector.x;
                        unit.vy = tankSlideVector.y;
                    }
                }
            return unit;
        case 'drone':
            let droneTopSpeed = unit.v;
            if (unit.keyboard.capslock) {
                droneTopSpeed *= 2;
            }
            if (unit.keyboard.shift) {
                droneTopSpeed *= 1.5;
            }
            unit.isMoving = false;
            if (unit.directControl) {
                let droneVector = {x: 0, y: 0}; // special maths
                if (unit.keyboard.w || unit.keyboard.arrowup) { 
                    droneVector.y -= 1
                    unit.isMoving = true;
                }
                if (unit.keyboard.s || unit.keyboard.arrowdown) {
                    droneVector.y += 1
                    unit.isMoving = true;
                }
                if (unit.keyboard.a || unit.keyboard.arrowleft) { 
                    droneVector.x -= 1
                    unit.isMoving = true;
                }
                if (unit.keyboard.d || unit.keyboard.arrowright) { 
                    droneVector.x += 1
                    unit.isMoving = true;
                }
                if (unit.isMoving) {
                    unit.r = aim({x:0, y: 0}, droneVector);
                }
            }
            if (unit.isMoving) {
                let droneAcceleration = toComponent(droneTopSpeed/60, unit.r);
                unit.vx += droneAcceleration.x;
                unit.vy += droneAcceleration.y;
                let droneVelocity = Math.sqrt(unit.vx**2+unit.vy**2);
                if (droneVelocity > unit.v) {
                    let reduction = unit.v / droneVelocity;
                    unit.vx *= reduction;
                    unit.vy *= reduction;
                }
            }
            unit.x += unit.vx;
            unit.y += unit.vy;
            if (handleGroundCollisions(unit, obstacles)) {
                unit.x -= unit.vx;
                unit.y -= unit.vy;
                unit.vx = 0;
                unit.vy = 0;
            }
            unit.vx *= 0.995;
            unit.vy *= 0.995;
            return unit;
        case 'staticTurret':
            if (unit.keyboard.w || unit.keyboard.arrowup) { 
                unit.y -= unit.v;
                unit.vy = -unit.v;
            }
            if (unit.keyboard.s || unit.keyboard.arrowdown) {
                unit.y += unit.v;
                unit.vy = unit.v;
            }
            if (unit.keyboard.a || unit.keyboard.arrowleft) { 
                unit.x -= unit.v;
                unit.vx = -unit.v;
            }
            if (unit.keyboard.d || unit.keyboard.arrowright) { 
                unit.x += unit.v;
                unit.vx = unit.v;
            }
            return unit;
        default:
            throw 'ERROR: are you f**king retarded? Tf is that unit type?';

    };
};

function polygonCollision(polygon1, polygon2) {
    for (let i = 0; i < polygon1.length; i++) {
        if (pointInPolygon(polygon1[i], polygon2)) {
            return true;
        }
    }
    for (let i = 0; i < polygon2.length; i++) {
        if (pointInPolygon(polygon2[i], polygon1)) {
            return true;
        }
    }
    return false;
};

function polygonCircleIntersect(polygon, circle, round=false, collisionEdges) {
    for (let i = 0; i < polygon.length; i++) {
        if (collisionEdges) {
            if (isin(i, collisionEdges) == false) {
                continue;
            }
        }
        let l1 = {start: polygon[i], end: i == polygon.length-1 ? polygon[0] : polygon[i+1]};
        if (round) {
            l1.start.x = Math.round(l1.start.x);
            l1.start.y = Math.round(l1.start.y);
            l1.end.x = Math.round(l1.end.x);
            l1.end.y = Math.round(l1.end.y);
            circle.x = Math.round(circle.x);
            circle.y = Math.round(circle.y);
        }
        if (lineCircleIntersectV2(l1, circle)) {
            return l1;
        }
    }
    return false;
};

function lineCircleIntersectV2(line, circle) { // HAIL OUR AI OVERLORDS
    //console.log(line, circle);
    // Calculate the direction vector of the line
    const dx = line.end.x - line.start.x;
    const dy = line.end.y - line.start.y;

    // Calculate the vector from the circle's center to the line's start point
    const cx = circle.x - line.start.x;
    const cy = circle.y - line.start.y;

    // Calculate the dot product of the line direction vector and the circle-to-start vector
    const dotProduct = cx * dx + cy * dy;

    // Calculate the squared length of the line
    const lineLengthSq = dx * dx + dy * dy;

    // Calculate the closest point on the line to the circle's center
    let closestX, closestY;

    if (lineLengthSq === 0) {
        // If the line is just a point, set the closest point to be the line's start point
        closestX = line.start.x;
        closestY = line.start.y;
    } else {
        const t = Math.max(0, Math.min(1, dotProduct / lineLengthSq));
        closestX = line.start.x + t * dx;
        closestY = line.start.y + t * dy;
    }

    // Calculate the distance between the closest point and the circle's center
    const distance = Math.sqrt((closestX - circle.x) ** 2 + (closestY - circle.y) ** 2);

    // Check if the distance is less than or equal to the circle's radius
    return distance <= circle.r;
};

function simulatePhysics(objects) {
    let newObjs = [];
    for (let i = 0; i < objects.length; i++) {
        let newObj = JSON.parse(JSON.stringify(objects[i]));
        newObj.vx += newObj.ax;
        newObj.vy += newObj.ay;
        newObj.vr += newObj.ar;
        newObj.vx *= newObj.vDrag;
        newObj.vy *= newObj.vDrag;
        newObj.vr *= newObj.rDrag;
        let velocity = Math.sqrt(Math.abs(newObj.vx**2) + Math.abs(newObj.vy**2));
        if (velocity > newObj.maxV) {
            let reduction = newObj.maxV / velocity;
            newObj.vx *= reduction;
            newObj.vy *= reduction;
        }
        newObj.vr = Math.min(newObj.vr, newObj.maxRV);
        newObj.x += newObj.vx;
        newObj.y += newObj.vy;
        newObj.r += newObj.vr;
        newObjs.push(newObj);
    }
    return newObjs;
};

function renderParticles(particles) {
    for (let i = 0; i < particles.length; i++) {
        let obj = particles[i];
        if (obj.type == 'circle') {
            drawCircle(obj.x, obj.y, obj.size, toColour(obj.style.fill), toColour(obj.style.stroke.colour), obj.style.stroke.width, 1, false);
        } else if (obj.type == 'polygon') {
            drawPolygon(obj.size, {x: obj.x, y: obj.y}, obj.r, toColour(obj.style.fill), {colour: toColour(obj.style.stroke.colour), width: obj.style.stroke.width}, false);
        } else {
            throw 'ERROR: unsupported particle type';
        }
    }
};

function recursiveParts(unit, parts, f) {
    for (let i = 0; i < parts.length; i++) {
        parts[i] = f(unit, parts[i]);
        //parts[i].connected = recursiveParts(unit, parts[i].connected, f);
    }
    return parts;
};

function renderPart(unit, part) {
    console.log(part);
    if (part.type == 'polygon') {
        let np = offsetPoints(rotatePolygon(JSON.parse(JSON.stringify(part.size)), part.rOffset), part.offset);
        for (let i = 0; i < np.length; i++) {
            np[i].x *= part.scale.x;
            np[i].y *= part.scale.y;
        }
        let facing = unit.r;
        if (part.facing == 'turret') {
            facing = unit.mouseR;
        }
        drawPolygon(np, {x: unit.x, y: unit.y}, facing, part.style.fill, part.style.stroke, false);
    } else {
        if (part.scale.x != 0 || part.scale.y != 0) {
            let np = circleToPolygon({x: 0, y: 0}, part.size, 25);
            console.log(np);
            for (let i = 0; i < np.length; i++) {
                np[i].x *= part.scale.x;
                np[i].y *= part.scale.y;
            }
            np = offsetPoints(rotatePolygon(np, part.rOffset), part.offset);
            let facing = unit.r;
            if (part.facing == 'turret') {
                facing = unit.mouseR;
            }
            drawPolygon(np, {x: unit.x, y: unit.y}, facing, part.style.fill, part.style.stroke, false);
        } else {
            let facing = unit.r;
            if (part.facing == 'turret') {
                facing = unit.mouseR;
            }
            let offset = rotatePolygon([part.offset], facing)[0];
            drawCircle(unit.x + offset.x, unit.y + offset.y, part.size, part.style.fill, part.style.stroke.colour, part.style.stroke.width, 1, false);
        }
    }
    return part;
};

function renderUnit(unit) {
    recursiveParts(unit, unit.parts, renderPart);
    if (unit.collisionR > 0 && false) {
        drawCircle(display.x/2 - player.x + unit.x, display.y/2 - player.y + unit.y, unit.collisionR, 'rgba(255, 255, 255, 0.1)', 'rgba(255, 0, 0, 0.9)', 5, 1);
    }
    if (unit.groundCollisionR > 0) {
        drawCircle(unit.x, unit.y, unit.groundCollisionR, 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.1)', 5, 1, false);
    }
    if (unit.tallCollisionR > 0) {
        drawCircle(unit.x, unit.y, unit.tallCollisionR, 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.1)', 5, 1, false);
    }
    //drawLine(unit, aim(unit, unit.aimPos)-Math.PI/2, 1500, data.red.stroke, false);
};

function shoot(unit, part) {
    if (part.cannon) {
        if (part.cannon.reload.c > 0) {
            part.cannon.reload.c -= 1;
        } else {
            if (!part.cannon.delay || part.cannon.delay.c <= 0) {
                if (unit.keyboard[part.cannon.keybind]) {
                    part.cannon.reload.c = part.cannon.reload.t;
                    let facing = unit.r;
                    if (part.facing == 'turret') {
                        facing = unit.mouseR;
                    }
                    let bullet = Object.assign({}, JSON.parse(JSON.stringify(data.template.physics)), JSON.parse(JSON.stringify(part.cannon.bullet)));
                    bullet.x = unit.x + ((part.offset.x) * Math.cos(facing) - (part.offset.y) * Math.sin(facing));
                    bullet.y = unit.y + ((part.offset.x) * Math.sin(facing) + (part.offset.y) * Math.cos(facing));
                    bullet.x += (part.cannon.x * Math.cos(facing + part.rOffset) - (part.cannon.y) * Math.sin(facing + part.rOffset));
                    bullet.y += ((part.cannon.x) * Math.sin(facing + part.rOffset) + (part.cannon.y) * Math.cos(facing + part.rOffset));
                    facing += normalDistribution(0, part.cannon.spread);
                    let res = toComponent(bullet.v, facing + part.rOffset);
                    bullet.vx = res.x + unit.vx;
                    bullet.vy = res.y + unit.vy;
                    if (bullet.accel) {
                        bullet.vx -= unit.vx;
                        bullet.vy -= unit.vy;
                    }
                    bullet.r = facing + part.rOffset;
                    /*
                    bullet.vr = part.cannon.bullet.vr;
                    bullet.rDrag = part.cannon.bullet.rDrag;*/
                    projectiles.push(bullet);
                }
            }
            if (part.cannon.delay) {
                if (unit.keyboard[part.cannon.keybind]) {
                    part.cannon.delay.c -= 1;
                } else {
                    part.cannon.delay.c = part.cannon.delay.t;
                }
            }
        }
    }
    return part;
};

function handleShooting(unit) {
    unit.parts = recursiveParts(unit, unit.parts, shoot);
    return unit;
};

function handleDecay(objs) {
    let newObjs = []
    for (let i = 0; i < objs.length; i++) {
        let obj = objs[i];
        //console.log(obj);
        obj.decay.life -= 1;
        if(obj.decay.life > 0) {
            if (obj.type == 'polygon') {
                for (let j = 0; j < obj.size.length; j++) {
                    obj.size[j].x *= obj.decay.size;
                    obj.size[j].y *= obj.decay.size;
                }
            } else {
                obj.size *= obj.decay.size;
            }
            obj.style.fill.r += obj.decay.fillStyle.r;
            obj.style.fill.g += obj.decay.fillStyle.g;
            obj.style.fill.b += obj.decay.fillStyle.b;
            obj.style.fill.a += obj.decay.fillStyle.a;
            obj.style.stroke.r += obj.decay.strokeStyle.r;
            obj.style.stroke.g += obj.decay.strokeStyle.g;
            obj.style.stroke.b += obj.decay.strokeStyle.b;
            obj.style.stroke.a += obj.decay.strokeStyle.a;
            newObjs.push(obj);
        }
    }
    return newObjs;
};

function recursiveCollision(unit, parts, object) {
    let pts = JSON.parse(JSON.stringify(parts));
    let obj = JSON.parse(JSON.stringify(object));
    for (let i = 0; i < pts.length; i++) {
        if (pts[i].collision) {
            let collide = false;
            if (pts[i].type == 'polygon') {
                let cType = '';
                if (obj.cType) {
                    cType = obj.cType;
                } else {
                    cType = obj.type;
                }
                let facing = unit.r;
                if (pts[i].facing == 'turret') {
                    facing = unit.mouseR;
                }
                let points = offsetPoints(rotatePolygon(offsetPoints(JSON.parse(JSON.stringify(pts[i].size)), pts[i].offset), facing), unit);
                switch (cType) {
                    case 'point':
                        //drawCircle(display.x/2 - player.x + obj.x, display.y/2 - player.y + obj.y, 5, 'rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 1)', 2, 1);
                        if (pointInPolygon(obj, points)) {
                            collide = true;
                        }
                        break;
                    case 'circle':
                        let r = 0;
                        if (obj.size) {
                            r = obj.size;
                        } else if (obj.r) {
                            r = obj.r;
                        } else {
                            console.warn('WARNING: can\'t find radius!');
                        }
                        let notCircle = circleToPolygon(obj, r, 10); // a decagon is close enough to a circle
                        if (polygonCollision(notCircle, points)) {
                            collide = true;
                        }
                        break;
                    case 'polygon': // unreliable
                        if (polygonCollision(offsetPoints(rotatePolygon(JSON.parse(JSON.stringify(obj.size)), obj.r), obj), points)) {
                            collide = true;
                        }
                        break;
                    case 'line': // TODO: make it actual line collision (currently many point collisions)
                        let s = offsetPoints(rotatePolygon([JSON.parse(JSON.stringify(obj.cSize.start)), JSON.parse(JSON.stringify(obj.cSize.end))], obj.r), obj);
                        let segment = {start: s[0], end: s[1]};
                        let diff = vMath(segment.end, segment.start, '-');
                        for (let i = 0.1; i < 1; i += 0.2) {
                            let point = vMath(JSON.parse(JSON.stringify(segment.start)), vMath(JSON.parse(JSON.stringify(diff)), i, '*'), '+');
                            //drawCircle(display.x/2 - player.x + point.x, display.y/2 - player.y + point.y, 5, 'rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 1)', 2, 1);
                            //drawPolygon(points, {x: 0, y: 0}, 0, 'rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 1)', false, true);
                            if (pointInPolygon(point, points)) {
                                collide = true;
                                break;
                            } 
                        }
                        break;
                    default:
                        console.log(obj);
                        throw `ERROR: wtf is this object type! ${cType}`;
                }
            } else {
                //console.log(getDist(offsetPoints(JSON.parse(JSON.stringify([pts[i].offset])), unit)[0], obj));
                let cType = '';
                if (obj.cType) {
                    cType = obj.cType;
                } else {
                    cType = obj.type;
                }
                switch (cType) {
                    case 'point':
                        if (getDist(vMath(JSON.parse(JSON.stringify(pts[i].offset)), unit, 'add'), obj) <= pts[i].size) {
                            collide = true;
                        }
                        break;
                    case 'circle':
                        let r = obj.size;
                        if (getDist(vMath(JSON.parse(JSON.stringify(pts[i].offset)), unit, 'add'), obj) <= pts[i].size + r) {
                            collide = true;
                        }
                        break;
                    case 'polygon':
                        let notCircle = circleToPolygon(pts[i], pts[i].size, 10); // a decagon is close enough to a circle
                        if (polygonCollision(notCircle, obj.size)) {
                            collide = true;
                        }
                        break;
                    case 'line':
                        let s = offsetPoints(rotatePolygon([JSON.parse(JSON.stringify(obj.cSize.start)), JSON.parse(JSON.stringify(obj.cSize.end))], obj.r), obj);
                        let segment = {start: s[0], end: s[1]};
                        if (lineCircleIntersectV2(segment, {x: unit.x, y: unit.y, r: unit.size})) {
                            collide = true;
                        }
                        break;
                    default:
                        throw `ERROR: wtf is this object type2! ${cType}`;
                }
            }
            if (collide) {
                pts[i].hp -= obj.dmg;
                //console.log(pts[i].id, pts[i].hp);
                pts[i].isHit=5;
                if (obj.explosion) {
                    obj.explosion.x = obj.x;
                    obj.explosion.y = obj.y;
                    obj.explosion.transparancy = 1;
                    obj.explosion.active = true;
                    obj.explosion.type = 'circle';
                    obj.explosion.isExplosion = true;
                    explosions.push(obj.explosion);
                } 
                if (!obj.isExplosion || !obj.active) {
                    obj.dmg = 0; // have to do this to stop it hitting multiple pts (this is inefficient but hard to fix. maybe rework this to not use recursion? bfs?)
                    return [pts, obj];
                }
            }
        }
        //let res = recursiveCollision(unit, pts[i].connected, obj);
        //pts[i].connected = res[0];
        //obj = res[1];
    }
    return [pts, obj];
};

function handleCollisions(units, projectiles, accurate) {
    let newProj = [];
    if (projectiles.length && units.length) {
        for (let i = 0; i < projectiles.length; i++) {
            if (accurate) {
                let calcs = Math.abs(projectiles[i].v)/50;
                for (let k=0; k < calcs; k++) {
                    for (let j = 0; j < units.length; j++) {
                        if (units[j].noClip) {
                            continue;
                        }
                        let ncoords = vMath(projectiles[i], vMath({x: projectiles[i].vx, y: projectiles[i].vy}, k, '*'), '+');
                        let oldP = {x: projectiles[i].x, y: projectiles[i].y};
                        let np = JSON.parse(JSON.stringify(projectiles[i]));
                        np.x = ncoords.x;
                        np.y = ncoords.y;
                        //console.log(ncoords);
                        if (getDist(ncoords, units[j]) <= units[j].collisionR) {
                            //console.log(units[j]);
                            let res = recursiveCollision(units[j], units[j].parts, np);
                            units[j].parts = res[0];
                            projectiles[i] = res[1];
                            projectiles[i].x = oldP.x;
                            projectiles[i].y = oldP.y;
                        }
                    }
                }
            } else {
                for (let j = 0; j < units.length; j++) {
                    if (getDist(projectiles[i], units[j]) <= units[j].collisionR) {
                        //console.log(units[j]);
                        let res = recursiveCollision(units[j], units[j].parts, projectiles[i]);
                        units[j].parts = res[0];
                        projectiles[i] = res[1];
                    }
                }
            } 
            if (projectiles[i].dmg != 0) {
                newProj.push(projectiles[i]);
            }
        }
        return [units, newProj];
    }
    return [units, projectiles];
};

function handleBulletWallCollisions(obstacles, projectiles) {
    let newProj = [];
    if (projectiles.length && obstacles.length) {
        for (let i = 0; i < projectiles.length; i++) {
            let noHit = true;
            for (let j = 0; j < obstacles.length; j++) {
                if (obstacles[j].cType == 'tall') {
                    if (pointInPolygon(projectiles[i], obstacles[j].size)) {
                        noHit = false;
                        break;
                    }
                }
            }
            if (noHit) {
                newProj.push(projectiles[i]);
            }
        }
        return newProj;
    }
    return projectiles;
};

function obstacleCollision(unit, obstacle) {
    let collisionR = 0;
    if (obstacle.cType == 'ground') {
        if (unit.groundCollisionR <= 0) {
            return false;
        }
        collisionR = unit.groundCollisionR;
    } else {
        collisionR = unit.tallCollisionR;
    }
    //let notCircle = circleToPolygon(unit, collisionR, 12); // a dodecagon is close enough to a circle
    //return polygonCollision(notCircle, obstacle.size);
    //return polyCollisionAdv(notCircle, obstacle.size);
    return polygonCircleIntersect(obstacle.size, {x: unit.x, y: unit.y, r: collisionR}, true, obstacle.collisionEdges);
};

function handleGroundCollisions(u, obstacles, smort=false, prevMotion=null) {
    let unit = JSON.parse(JSON.stringify(u));
    let hasCollided = false;
    for (let i = 0; i < obstacles.length; i++) {
        let obstacle = obstacles[i];
        let res = obstacleCollision(unit, obstacle);
        if (res) {
            hasCollided = true;
            let thisVectorWorks = true;
            if (smort) { // f*ck optimisation, if it works it works
                unit.x -= prevMotion.x;
                unit.y -= prevMotion.y;
                let mechWallVector = {x: res.end.x - res.start.x, y: res.end.y - res.start.y};
                let mechSlideVector = vMath(vMath(prevMotion, mechWallVector, 'projection'), 0.75, 'multiply');
                unit.x += mechSlideVector.x;
                unit.y += mechSlideVector.y;
                unit.vx = mechSlideVector.x;
                unit.vy = mechSlideVector.y;
                for (let j = 0; j < obstacles.length; j++) {
                    if (obstacleCollision(unit, obstacles[j])) {
                        thisVectorWorks = false;
                        break;
                    }
                }
            }
            if (thisVectorWorks) {
                return res;
            }
        }
    }
    if (hasCollided) {
        return 'well, shit'; // this just means a suitable vector was not found and the unit is rooted in place as a last resort
    }
    return false; 
};

function checkDeadParts(unit, parts) {
    //console.log(unit, parts);
    /*
    if (parts) {
        let newParts = [];
        for (let i = 0; i < parts.length; i++) {
            if (parts[i].hp > 0) {
                parts[i].connected = checkDeadParts(unit, parts[i].connected);
                newParts.push(parts[i]);
            } else {
                if (parts[i].core) {
                    unit.alive = false;
                }
            }
        }
        //console.log(newParts);
        return newParts;
    }*/
    return parts;
};

function detectShieldCollision(shield, obj) { 
    let cType = '';
    if (obj.cType) {
        cType = obj.cType;
    } else {
        cType = obj.type;
    }
    switch (cType) {
        case 'point':
            if (getDist(shield, obj) <= shield.r) {
                return true;
            }
            break;
        case 'circle':
            let r = obj.size;
            if (getDist(shield, obj) <= shield.r + obj.size) {
                return true;
            }
            break;
        case 'polygon':
            let notCircle = circleToPolygon(shield, shield.r, 10); // a decagon is close enough to a circle
            if (polygonCollision(notCircle, obj.size)) {
                return true;
            }
            break;
        case 'line':
            let s = offsetPoints(rotatePolygon([JSON.parse(JSON.stringify(obj.cSize.start)), JSON.parse(JSON.stringify(obj.cSize.end))], obj.r), obj);
            let segment = {start: s[0], end: s[1]};
            if (lineCircleIntersectV2(segment, shield)) {
                return true;
            }
            break;
        default:
            throw `ERROR: wtf is this object type! ${cType}`;
    }
    return false;
};

function handleShields(unit, parts) {
    //console.log(unit, parts);
    if (parts) {
        for (let i = 0; i < parts.length; i++) {
            if (parts[i].shield) {
                if (unit.keyboard[parts[i].shield.keybind]) {
                    unit.keyboard[parts[i].shield.keybind] = false;
                    if (parts[i].shield.active) {
                        parts[i].shield.active = false;
                    } else {
                        if (parts[i].shield.hp >= parts[i].shield.minHp) {
                            parts[i].shield.active = true;
                        }
                    }
                }
                if (parts[i].shield.active) {
                    let shield = parts[i].shield;
                    // center the shield around the unit
                    shield.x = unit.x;
                    shield.y = unit.y;
                    if (shield.hp < 0) {
                        shield.active = false;
                    }
                    shields.push(shield);
                    /*
                    for (let j = 0; j < projectiles.length; j++) {
                        if (detectCollision(unit, parts[i], projectiles[j])) {
                            parts[i].shield.hp -= projectiles[j].dmg;
                            if (parts[i].shield.hp <= 0) {
                                parts[i].shield.hp = 0;
                                parts[i].shield.active = false;
                            }
                            projectiles[j].dmg = 0;
                        }
                    }
                    for (let j = 0; j < explosions.length; j++) {
                        if (detectCollision(unit, parts[i], explosions[j])) {
                            parts[i].shield.hp -= explosions[j].dmg;
                            if (parts[i].shield.hp <= 0) {
                                parts[i].shield.hp = 0;
                                parts[i].shield.active = false;
                            }
                        }
                    }*/

                }
                console.log(parts[i].shield.hp);
                parts[i].shield.hp += parts[i].shield.regen;
                if (parts[i].shield.hp > parts[i].shield.cap) {
                    parts[i].shield.hp = parts[i].shield.cap;
                } 
                if (parts[i].shield.hp < 0) {
                    parts[i].shield.hp = 0;
                }
                unit.noClip = parts[i].shield.active;
            } 
            parts[i].connected = handleShields(unit, parts[i].connected);
        }
        return parts;
    }
    return [];
};

function renderShield(shield) {
    //console.log(shield);
    //console.log(shield.hp/shield.cap*0.2, (1-(shield.hp/shield.cap))*0.2);
    //drawCircle(shield.x, shield.y, shield.r, `rgba(50, 200, 255, ${shield.hp/shield.cap*0.4})`, `rgba(40, 180, 230, ${shield.hp/shield.cap*0.4})`, 10, 1, false);
    //drawCircle(shield.x, shield.y, shield.r, `rgba(255, 0, 0, ${(1-(shield.hp/shield.cap))*0.2})`, `rgba(255, 0, 0, ${(1-(shield.hp/shield.cap))*0.2})`, 10, 1, false);
    drawCircle(shield.x, shield.y, shield.r, `rgba(${Math.round((1-(shield.hp/shield.cap))*255)}, 150, ${Math.round((shield.hp/shield.cap)*255)}, ${(shield.hp/shield.cap)*0.2+0.2})`, `rgba(${Math.round((1-(shield.hp/shield.cap))*220)}, 150, ${Math.round((shield.hp/shield.cap)*220)}, ${(shield.hp/shield.cap)*0.2+0.2})`, 10, 1, false);
};

function shieldCollisions(shields, projectiles) {
    for (let i = 0; i < shields.length; i++) {
        for (let j = 0; j < projectiles.length; j++) {
            if (detectShieldCollision(shields[i], projectiles[j])) {
                shields[i].hp -= projectiles[j].dmg;
                if (shields[i].hp <= 0) {
                    shields[i].hp = 0;
                    shields[i].active = false;
                }
                projectiles[j].dmg = 0;
            }
        }
    }
    return [shields, projectiles];
};

function runScript(checkpoint, unit, teams, obstacles, projectiles, explosions, particles, entities) { // return orders
    //unit = JSON.parse(JSON.stringify(unit));
    //teams = JSON.parse(JSON.stringify(teams));
    let player = undefined;
    let t = undefined;
    for (let i = 0; i < teams.length; i++) {
        if (teams[i].id == unit.team) {
            let script = teams[i].scripts[unit.script];
            if (script) {
                //console.log(script);
                //console.log(eval(script));
                return eval(script);
            } else {
                //console.warn('WARNING: no script found!');
                return [];
            }
        }
    }
    console.warn('WARNING: no team found!');
    return [];
    // throw 'ERROR: No script found';
};

function handleOrdersKeyPressMode(unit) {
    //console.log(unit);
    for (let i = 0; i < unit.orders.length; i++) {
        if (unit.orders[i].id == 'aim') {
            unit.keyboard.aimPos = unit.orders[i].value; // cordinate (absolute)
        }
        unit.keyboard[unit.orders[i].id] = unit.orders[i].value;
    }
    return unit;
};

function handleScript(unit) {
    if (unit.script) {
        unit.orders = runScript(JSON.parse(JSON.stringify(checkpoint)), JSON.parse(JSON.stringify(unit)), JSON.parse(JSON.stringify(teams)), JSON.parse(JSON.stringify(obstacles)), JSON.parse(JSON.stringify(projectiles)), JSON.parse(JSON.stringify(explosions)), JSON.parse(JSON.stringify(particles)), JSON.parse(JSON.stringify(entities)));
        unit = handleOrdersKeyPressMode(unit);
    }
    return unit;
};

function renderCheckpoint() {
    if (entities.length <= 1) {
        drawCircle(checkpoint.x + checkpoint.parts[0].offset.x, checkpoint.y + checkpoint.parts[0].offset.y, checkpoint.parts[0].size, checkpoint.parts[0].style.fill, checkpoint.parts[0].style.stroke.colour, checkpoint.parts[0].style.stroke.width, 1, false);
    } else {
        drawCircle(checkpoint.x + checkpoint.parts[0].offset.x, checkpoint.y + checkpoint.parts[0].offset.y, checkpoint.parts[0].size, checkpoint.parts[0].style2.fill, checkpoint.parts[0].style2.stroke.colour, checkpoint.parts[0].style2.stroke.width, 1, false);
    }
};

function handleCheckpoint() {
    /*
    if (getDist(player, checkpoint) < player.tallCollisionR + checkpoint.collisionR && entities.length == 1) {
        if (winTime < 0) {
            winTime = t;
        }
        var overlay = document.getElementById('overlay');
        if (overlay.style.display != 'block') {
            console.log(`game over in ${winTime} ticks (lower is better)`);
            overlay.innerHTML = `
            <h1>Level Complete</h1>
            <button onclick="loadLevel('MovementI')"><h3>Movement I</h3></button><button onclick="loadLevel('MovementII')"><h3>Movement II</h3></button><button onclick="loadLevel('MovementIII')"><h3>Movement III</h3></button><button onclick="loadLevel('MovementIV')"><h3>Movement IV</h3></button><br>
            <button onclick="loadLevel('AimingI')"><h3>Aiming I</h3></button><button onclick="loadLevel('AimingII')"><h3>Aiming II</h3></button><button onclick="loadLevel('AimingIII')"><h3>Aiming III</h3></button><button onclick="loadLevel('AimingIV')"><h3>Aiming IV</h3></button><button onclick="loadLevel('AimingV')"><h3>Aiming V</h3></button><br>
            <button onclick="loadLevel('TacticsI')"><h3>Tactics I</h3></button><button onclick="loadLevel('TacticsII')"><h3>Tactics II</h3></button><button onclick="loadLevel('TacticsIII')"><h3>Tactics III</h3></button><button onclick="loadLevel('TacticsIV')"><h3>Tactics IV</h3></button><br>
            <button onclick="loadLevel('CombatI')"><h3>Combat I</h3></button><button onclick="loadLevel('CombatII')"><h3>Combat II</h3></button><button onclick="loadLevel('CombatIII')"><h3>Combat III</h3></button><button onclick="loadLevel('CombatIV')"><h3>Combat IV</h3></button><button onclick="loadLevel('CombatV')"><h3>Combat V</h3></button><button onclick="loadLevel('CombatVI')"><h3>Combat VI</h3></button><button onclick="loadLevel('CombatVII')"><h3>Combat VII</h3></button><br>
            <button onclick="loadLevel('MeleeI')"><h3>Melee I</h3></button><button onclick="loadLevel('MeleeII')"><h3>Melee II</h3></button><button onclick="loadLevel('MeleeIII')"><h3>Melee III</h3></button><br>`;
            overlay.style.display = 'block';
            return true;
        }
    }*/
    return false;
};

function physics() {
    shields = [];
    let newEntities = [];
    for (let i = 0; i < entities.length; i++) {
        //console.log(entities[i]);
        entities[i].parts = checkDeadParts(entities[i], entities[i].parts);
        entities[i] = handleScript(entities[i]);
        entities[i] = handlePlayerMotion(entities[i], obstacles);
        entities[i] = handleShooting(entities[i]);
        entities[i].parts = handleShields(entities[i], entities[i].parts);
        if (entities[i].alive) {
            newEntities.push(entities[i]);
        }
    }
    entities = newEntities;

    projectiles = simulatePhysics(projectiles);
    projectiles = handleDecay(projectiles);

    let newExpl = [];
    for (let i = 0; i < explosions.length; i++) {
        let res = handleExplosion(explosions[i]);
        if (res) {
            newExpl.push(res);
        }
    }
    explosions = newExpl;

    let res = shieldCollisions(shields, projectiles, true);
    shields = res[0];
    projectiles = res[1];

    res = shieldCollisions(shields, explosions, true);
    shields = res[0];
    res = handleCollisions(entities, projectiles, true);
    entities = res[0];
    projectiles = res[1];

    res = handleCollisions(entities, explosions, false);
    entities = res[0];
    projectiles = handleBulletWallCollisions(obstacles, projectiles);

    let gameState = handleCheckpoint();
    return gameState;
};

function graphics(step) {
    player.x -= player.vx*(1-step/FPT);
    player.y -= player.vy*(1-step/FPT);
    clearCanvas('main');
    clearCanvas('canvasOverlay');
    grid(400, player);
    renderCheckpoint();
    for (let i = 0; i < obstacles.length; i++) {
        if (obstacles[i].cType == 'ground') {
            //console.log(obstacles[i]);
            drawPolygon(obstacles[i].size, {x: 0, y: 0}, 0, obstacles[i].style.fill, obstacles[i].style.stroke, false);
        }
    }
    for (let i = 0; i < entities.length; i++) {
        let newEntity = JSON.parse(JSON.stringify(entities[i]));
        if (i != 0) {
            newEntity.x -= newEntity.vx*(1-step/FPT);
            newEntity.y -= newEntity.vy*(1-step/FPT);
        }
        renderUnit(newEntity);
    }

    let newProj = JSON.parse(JSON.stringify(projectiles));
    for (let i = 0; i < newProj.length; i++) {
        newProj[i].x -= newProj[i].vx*(1-step/FPT);
        newProj[i].y -= newProj[i].vy*(1-step/FPT);
    }
    renderParticles(newProj);

    for (let i = 0; i < obstacles.length; i++) {
        if (obstacles[i].cType == 'tall') {
            //console.log(obstacles[i]);
            drawPolygon(obstacles[i].size, {x: 0, y: 0}, 0, obstacles[i].style.fill, obstacles[i].style.stroke, false);
        }
    }

    for (let i = 0; i < shields.length; i++) {
        renderShield(shields[i]);
    }
    for (let i = 0; i < explosions.length; i++) {
        renderExplosion(explosions[i]);
    }
    player.x += player.vx*(1-step/FPT);
    player.y += player.vy*(1-step/FPT);
};

/*
function main() {
    const startRendering1Time = performance.now();
    // draw the background
    clearCanvas('main');
    clearCanvas('canvasOverlay');
    shields = [];
    grid(400);

    // Render ground obstacles
    for (let i = 0; i < obstacles.length; i++) {
        if (obstacles[i].cType == 'ground') {
            //console.log(obstacles[i]);
            drawPolygon(obstacles[i].size, {x: 0, y: 0}, 0, obstacles[i].style.fill, obstacles[i].style.stroke, false);
        }
    }

    let gameState = handleCheckpoint();
    const startEntityProcessingTime = performance.now();
    // Process entities
    let newEntities = [];
    for (let i = 0; i < entities.length; i++) {
        //console.log(entities[i]);
        entities[i].parts = checkDeadParts(entities[i], entities[i].parts);
        entities[i] = handleScript(entities[i]);
        entities[i] = handlePlayerMotion(entities[i], obstacles);
        entities[i] = handleShooting(entities[i]);
        entities[i].parts = handleShields(entities[i], entities[i].parts);
        if (entities[i].alive) {
            newEntities.push(entities[i]);
        }
    }
    entities = newEntities;

    const startProjectileProcessingTime = performance.now();
    // Process Projectiles
    projectiles = simulatePhysics(projectiles);
    projectiles = handleDecay(projectiles);

    const startRendering2Time = performance.now();
    // Render Entities
    for (let i = 0; i < entities.length; i++) {
        renderUnit(entities[i]);
    }
    renderParticles(projectiles);

    // Render Tall obstacles
    for (let i = 0; i < obstacles.length; i++) {
        if (obstacles[i].cType == 'tall') {
            //console.log(obstacles[i]);
            drawPolygon(obstacles[i].size, {x: 0, y: 0}, 0, obstacles[i].style.fill, obstacles[i].style.stroke, false);
        }
    }

    for (let i = 0; i < shields.length; i++) {
        renderShield(shields[i]);
    }

    const startExplosionProcessingTime = performance.now();
    // Handle explosions
    let newExpl = [];
    for (let i = 0; i < explosions.length; i++) {
        let res = handleExplosion(explosions[i]);
        if (res) {
            newExpl.push(res);
        }
    }
    explosions = newExpl;

    const startCollisionProcessingTime = performance.now();
    // Handle Collisions
    const sc = performance.now();
    let res = shieldCollisions(shields, projectiles, true);
    shields = res[0];
    projectiles = res[1];

    res = shieldCollisions(shields, explosions, true);
    shields = res[0];
    const ec = performance.now();
    res = handleCollisions(entities, projectiles, true);
    entities = res[0];
    projectiles = res[1];

    res = handleCollisions(entities, explosions, false);
    entities = res[0];
    const end = performance.now();
    projectiles = handleBulletWallCollisions(obstacles, projectiles);

    const endTime = performance.now();
    if(entities.length <= 1) {
        //console.warn('all enemies dead!');
    }
    console.log(`Total Shield Processing: ${ec-sc}`);
    console.log(`Total Entity Processing: ${end-ec}`);
    
    console.log(`Total Rendering: ${startEntityProcessingTime-startRendering1Time + startExplosionProcessingTime-startRendering2Time}`);
    console.log(`Total Entity Processing: ${startProjectileProcessingTime-startEntityProcessingTime}`);
    console.log(`Total Projectile Processing: ${startRendering2Time-startProjectileProcessingTime}`);
    console.log(`Total Explosion Processing: ${startCollisionProcessingTime-startExplosionProcessingTime}`);
    console.log(`Total Collision Processing: ${endTime-startCollisionProcessingTime}`);
    console.log(`Total ms/tick: ${endTime-startRendering1Time}, max: ${1000/TPS}ms`);
    return gameState;
};*/

function main() {
    let gameState = undefined;
    const start = performance.now();
    graphics(t%FPT);
    if (t%FPT == 0) {
        const start2 = performance.now();
        gameState = physics();
        const end2 = performance.now();
        //console.log(`Physics Processing Time: ${end2-start2}ms`);
    }
    t++;
    const end = performance.now();
    //console.log(`Processing Time: ${end-start}ms, max: ${1000/FPS}ms for ${FPS}fps. Max Possible FPS: ${1000/(end-start)}`);
    return gameState;
};

var t=0
var winTime = -1;
var paused = false;
const TPS = data.constants.TPS;
const FPS = data.constants.FPS;
const FPT = FPS/TPS;
async function game() {
    while (1) {
        if (paused == false) {
            if (main()) {
                break;
            }
            await sleep(1000/FPS);
        } else {
            await sleep(1000/30);
        }
        if (player.keyboard['`']) {
            console.log('toggle pause');
            player.keyboard['`'] = false;
            paused = !paused;
            if (paused) {
                var overlay = document.getElementById('overlay');
                overlay.style.display = 'block';
                overlay.innerHTML = `<h1>Paused</h1>`;
                overlay.innerHTML += `
<form>
<label for="script1">Script 1</label><br>
<textarea id="script1" rows="50" cols="90" maxlength="100000">
let orders = [];

// Insert javascript code here
// You may need to look at the game's source code to see what variables you have access to
// I strongly recommend writing code in an external editor, 
// code written here will not be saved, and can not be editted once submitted
// changing your code will require rewriting it or copying it in from an external editor
// Don't alter this if you do not wish to control your unit with a script
// Also, press \'\`\' to unpause or the Load Script button to activate your program

return orders;
</textarea>
</form>
<button onclick="loadScript('Player', 1)"><h3>Load Script</h3></button>
                `;
            } else {
                overlay.style.display = 'none';
            }
        }
    }
};
