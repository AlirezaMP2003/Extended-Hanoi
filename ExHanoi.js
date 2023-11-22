
function Hanoi(numberDisks , origin , helper , target) {
    if (numberDisks == 0) {
        return [];
    }
    else{
        return[
            ...Hanoi(numberDisks - 1, origin , target , helper),
            [origin , target],
            ...Hanoi(numberDisks - 1 , helper , origin , target)
        ];
    }
}

function exHanoi(numberDisks , origin , helper , target) {
    if (numberDisks == 0) {
        return [];
    }
    else{
        return[
            ...exHanoi(numberDisks - 1, origin , helper , target),
            ...Hanoi(3*numberDisks - 2, target, origin, helper),
            [origin , target],
            ...Hanoi(3*numberDisks - 1 , helper , origin , target)
        ];
    }
}

let diskNumber = 1;
let pegs;
let delay = 1000;
let pegOrder = [0,1,2];
let paused;
let nextIndex;

function fillDisks() {
    paused = false;
    nextIndex = 0;
    pegs = [[],[],[]];
    $("#numberInput").val(diskNumber);
    $("#delayInput").val(delay);
    $(".disk").remove();
    $("#game").css("--disk-number" , diskNumber);

    let sec;
    let thir;
    let newnumdisk = 3*diskNumber;
    let diskH = newnumdisk + 1;
    for (let i = newnumdisk; i >= 1; i = i-3) {  
        
        diskH--;
        sec = i-1;
        thir = i-2;
        
        pegs[0].push(i);
        $("<div></div>").addClass("disk")
        .css("transition-duration" , `${Math.round(delay/4.5)}ms`)
        .attr("id" , i)
        .css("--size" , i)
        .css("--x" , 0)
        .css("--y" , newnumdisk - diskH + 1)
        .appendTo("#game");

        pegs[1].push(sec);
        $("<div></div>").addClass("disk")
        .css("transition-duration" , `${Math.round(delay/4.5)}ms`)
        .attr("id" , sec)
        .css("--size" , sec)
        .css("--x" , 1)
        .css("--y" , newnumdisk - diskH + 1)
        .appendTo("#game");

        pegs[2].push(thir);
        $("<div></div>").addClass("disk")
        .css("transition-duration" , `${Math.round(delay/4.5)}ms`)
        .attr("id" , thir)
        .css("--size" , thir)
        .css("--x" , 2)
        .css("--y" , newnumdisk - diskH + 1)
        .appendTo("#game");
    }
}

fillDisks();

$("#startBtn").click( async () => {
    paused = false;
    $("#pauseBtn").prop("disabled" , false);
    $("#startBtn , #numberInput").prop("disabled" , true);
    const sequence = exHanoi(diskNumber , ...pegOrder);
    console.log(sequence);
    for (let i = nextIndex; i < sequence.length; i++) {       
        const [source , target] = sequence[i];
        await performMove(source , target);
        nextIndex = i+1;
        if (paused) break;
    }
    $("#pauseBtn").prop("disabled" , true);
    $("#startBtn , #numberInput").prop("disabled" , false);
    if (nextIndex == sequence.length) {
        $("#startBtn").prop("disabled" , true);
        $("#numberInput").prop("disabled" , false);
    }
});

$("#pauseBtn").click( () => paused = true );


async function performMove(source , target) {
    const diskId = pegs[source].pop();
    pegs[target].push(diskId);
    const disk = $(`#${diskId}`);
    disk.css("--y" , 12);
    await sleep(delay / 3);
    disk.css("--x" , target);
    await sleep(delay / 3);
    disk.css("--y" , pegs[target].length);
    await sleep(delay / 3);
}

$("#numberInput").change(function () {
    diskNumber = parseInt($(this).val());
    $("#startBtn").prop("disabled" , false);
    fillDisks();
});

$("#delayInput").change(function () {
    delay = parseInt($(this).val());
    $(".disk").css(
        "transition-duration",
        `${Math.round(delay/4.5)}ms`
    );
});

async function sleep(time) {
    return new Promise((res) => setTimeout(res,time));
}






$("#autoBtn").click(function () {
    $("#withHandBtn").css("display" , "none");
   $("#autoBtn").css("display" , "none"); 
   $("#startBtn").css("display" , "inline"); 
   $("#pauseBtn").css("display" , "inline"); 
});
$("#withHandBtn").click(function () {
    $("#withHandBtn").css("display" , "none");
   $("#autoBtn").css("display" , "none"); 
   $("#lastBtn").css("display" , "inline");
   $("#lastBtn").prop("disabled" , true);
   $("#allBtn").css("display" , "inline");
   $("#allBtn").prop("disabled" , true); 
   $("#nextBtn").css("display" , "inline"); 
});

var moves;
$("#nextBtn").click( async () => {
    $("#lastBtn").prop("disabled" , true);
    $("#nextBtn").prop("disabled" , true);
    $("#numberInput").prop("disabled" , true);
    $("#allBtn").prop("disabled" , true);
    moves = exHanoi(diskNumber , ...pegOrder);
    console.log(moves);
    const [source , target] = moves[nextIndex];
    await performMove(source , target);
    nextIndex++;
    $("#nextBtn").prop("disabled" , false);
    $("#lastBtn").prop("disabled" , false);
    $("#numberInput").prop("disabled" , false);
    $("#allBtn").prop("disabled" , false);
    if (nextIndex == moves.length) {
        $("#nextBtn").prop("disabled" , true);
        $("#lastBtn").prop("disabled" , false);
        $("#allBtn").prop("disabled" , true);
    }
});

$("#lastBtn").click( async () => {
    $("#nextBtn").prop("disabled" , true);
    $("#lastBtn").prop("disabled" , true);
    $("#numberInput").prop("disabled" , true);
    $("#allBtn").prop("disabled" , true);
    const [source , target] = moves[nextIndex - 1];
    await performMove(target , source);
    nextIndex--;
    $("#lastBtn").prop("disabled" , false);
    $("#nextBtn").prop("disabled" , false);
    $("#numberInput").prop("disabled" , false);
    $("#allBtn").prop("disabled" , false);
    if (nextIndex == 0) {
        $("#nextBtn").prop("disabled" , false);
        $("#lastBtn").prop("disabled" , true);
        $("#allBtn").prop("disabled" , true);
    }
});

$("#allBtn").click( async () => {
    $("#nextBtn").prop("disabled" , true);
    $("#lastBtn").prop("disabled" , true);
    $("#allBtn").prop("disabled" , true);
    $("#numberInput").prop("disabled" , true);

    for (let i = nextIndex; i < moves.length; i++) {       
        const [source , target] = moves[i];
        await performMove(source , target);
        nextIndex = i+1;
    }

    if (nextIndex == moves.length) {
        $("#nextBtn").prop("disabled" , true);
        $("#lastBtn").prop("disabled" , false);
        $("#allBtn").prop("disabled" , true);
        $("#numberInput").prop("disabled" , false);
    }
});