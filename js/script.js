'use strict'


let canv = document.getElementById('canv');
let ctx = canv.getContext('2d');

canv.width = document.body.getBoundingClientRect().width;
canv.height = document.body.getBoundingClientRect().height + parseInt(getComputedStyle(document.body).paddingBottom);

let grid = [];
const QUANTITYCELL = 50;
const SIZEGRID = window.innerWidth / QUANTITYCELL;
let arrAllParticle = [];
const SIZEPARTICLE = SIZEGRID / 2;
const FALLSPEED = 4;
let numberCreatedParticle = 1;
let idRequestAnimationFrame;

(()=>{
    let x = 0;
    for(let i = 0; i < QUANTITYCELL; i++){
        grid.push([{
            beginning: x,
            end: x + SIZEGRID
        }]);
        x += SIZEGRID;
    }
})();

function lines(){
    let x = 0;
    for(let i = 0; i < QUANTITYCELL; i++){
        let div = document.createElement('div');
        document.body.appendChild(div);
        div.classList.add('cell');
        div.style.left = x + 'px';

        x += SIZEGRID;

        let divs = document.createElement('div');
        document.body.appendChild(divs);
        divs.classList.add('cell');
        divs.style.left = x + 'px';  
    }
}

function neighborhoodCheck(arr, target){
    arr.forEach((neighbour)=>{
        if(typeof neighbour[0] == 'number'){
            if(neighbour[2].particleId != target[2].particleId){
                if(target[1] + SIZEPARTICLE > neighbour[1] && target[1] + SIZEPARTICLE < neighbour[1] + SIZEPARTICLE){
                    if(neighbour[0] + SIZEPARTICLE > target[0] && neighbour[0] < target[0] + SIZEPARTICLE){
                        if(!(neighbour[2].permissionToMove)){
                            target[2].permissionToMove = false;
                            target[2].color = 'rgb(5, 61, 126)';
                        }
                    } 
                }    
            }    
        }    
    });
}

function launchAnimation(){
    idRequestAnimationFrame = requestAnimationFrame(function drawingParticle(){
        ctx.clearRect(0, 0, canv.width, canv.height);
        grid.forEach((region)=>{
            if(region.length > 1){
                region.forEach((item)=>{
                    
                    if(typeof item[0] == 'number'){
                        ctx.beginPath();
                        ctx.fillStyle = item[2].color;
                        ctx.fillRect(item[0], item[1], SIZEPARTICLE, SIZEPARTICLE);
                        
                        if(item[2].permissionToMove){
                            neighborhoodCheck(region, item, []);
                        }    
            
                        if(item[2].permissionToMove) item[1] += item[2].FALLSPEED;

            
                        if(item[1] + SIZEPARTICLE >= canv.height){
                            item[2].permissionToMove = false;
                            item[2].color = 'rgb(5, 61, 126)';
                        }
                    }
                });
            }    
        });
        idRequestAnimationFrame = requestAnimationFrame(drawingParticle);
    });
}
launchAnimation();

function creatureParticle(index, x, y){
    let particle = [x, y, {
        FALLSPEED: randomX(3.5, 4) - Math.random(),
        permissionToMove: true,
        color: 'rgb(19, 167, 105)',
        neighbors: false,
        particleId: Math.random()
    }];
    grid[index].push(particle);
    if(index < grid.length - 1) grid[index + 1].push(particle);
    if(index > 0) grid[index - 1].push(particle);
}

function randomX(max, min){
    return Math.round(Math.random() * (max - min) + min);
}

function deleteParticle(){ 
    grid.forEach((cell)=>{
        for(let i = 0, len = cell.length/3; i < len; i++){
            let index = randomX(cell.length, 0);
            if(cell[index] && typeof cell[index][0] == 'number') cell.splice(index, 1);
        }    
    }) 

    grid.forEach((cell)=>{
        cell.forEach((item)=>{
            if(typeof item[0] == 'number'){
                item[2].color = '#670b0b';
                item[2].permissionToMove = true;
            }    
        }); 
    });
}

document.addEventListener('pointermove', (e)=>{  
    let x = e.pageX;
    let y = e.pageY;
    for(let i = 0; i < numberCreatedParticle; i++){
        let accessToCreation = false;
        
        grid.forEach((cell, index)=>{
            
            if(cell[0].beginning <= x && cell[0].end >= x){
                accessToCreation = index;  
                cell.forEach((item)=>{
                    if(y + SIZEPARTICLE > item[1] && y < item[1] + SIZEPARTICLE){
                        if(item[0] + SIZEPARTICLE > x && item[0] < x + SIZEPARTICLE){
                            accessToCreation = false;
                        } 
                    }    
                });
                return;
            } 
        });
        
        if(accessToCreation !== false){
            creatureParticle(accessToCreation, x, y);
        }

        x = x + Math.random() * 10 - Math.random() * 10;
        y = y + Math.random() * 10 - Math.random() * 10;
    }    
});
document.addEventListener('pointerup', (e)=>{
    if(e.target === canv) deleteParticle();
});