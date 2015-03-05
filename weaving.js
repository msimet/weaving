// A note on coding here:
// the "func"s given as arguments are passed that way so they're only called if the thing succeeds--so we don't call func() if some inputs are not correct.

function fixRounding(q) {
    if (Math.floor(q)<Math.floor(q+1.E-5)) {
        return q+1.E-5;
    } else {
        return q;
    }
}
    

function rounded(q) {
    q = fixRounding(q);
    if (typeof q!= 'string') {
        q = q.toFixed(2);
    }
    dotindx = q.indexOf('.');
    if (dotindx > -1 && dotindx < q.length-1) {
        while (q.substring(q.length-1)=='0') {
            q = q.substring(0,q.length-1);
        }
    }
    if (q.substring(q.length-1)=='.') {
        q = q.substring(0,q.length-1);
    }
    return q;
}    

function convert(q, unit) {
    if (unit=="yards" || unit=="yards, feet, and inches") {  // yards, feet and inches included for table-of-options only
        return q;
    } else if (unit=="meters") {
        return q*1.09361;
    } else if (unit=="feet") {
        return q/3.;
    } else if (unit=="inches") {
        return q/36.;
    } else if (unit=="cm") {
        return q*0.0109361;
    }
}    

function validateNumber(q, error_id) {
    if (!isFinite(q) || q<0) {
        document.getElementById(error_id).innerHTML = "Must be a number >0!";
        return 0;
    }
    document.getElementById(error_id).innerHTML = "";
    return 1;
}

function fractional_inch(q) {
    if (document.getElementById('round_inches').checked) {
        q = fixRounding(q);
        var qinch = Math.floor(q);
        var fracinch = q-qinch;
        if (fracinch) {
            fracinch = Math.floor(8*fracinch);
            if (fracinch==4) {
                return qinch + " 1/2";
            } else if (fracinch==0) {
                return qinch;
            } else if (fracinch%2==0) {
                return qinch + " " + fracinch/2 + "/4";
            } else {
                return qinch + " " + fracinch + "/8";
            }
        } else {
            return rounded(qinch);
        }
    } else {
        return rounded(q);
    }
}        
        
function convert_and_format(q, unit) {
    switch(unit) {
        case "yards":
            if (rounded(q)=='1') {
                return rounded(q) + " yard";
            } else {
                return rounded(q) + " yards";
            }
            break;
        case "meters":
            return rounded(q*0.9144) +" m";
            break;
        case "feet":
            if (rounded(q*3)=='1') {
                return rounded(q*3.)+' foot';
            } else {
                return rounded(q*3.)+" feet";
            }
            break;
        case "inches":
            if (rounded(q*36.)=='1') {
                return fixRoundq*36.+" inch";
            } else {
                return q*36.+" inches";
            }
            break;
        case "cm":
            return rounded(q*91.44)+" cm";
            break;
        case "yards, feet, and inches":
            q = fixRounding(q);
            yards = Math.floor(q);
            feet = Math.floor(fixRounding(3*(q-yards)));
            inches = 12*(3*(q-yards)-feet);
            if (yards>0) {
                if (rounded(yards)=='1') {
                    return_string = rounded(yards)+' yard';
                } else {
                    return_string = rounded(yards)+' yards';
                }
            } else {
                return_string = '';
            }
            if (feet>0) {
                if (return_string!='') {
                    return_string += ", "
                }
                if (rounded(feet)=='1') {
                    return_string += rounded(feet)+' foot';
                } else {
                    return_string += rounded(feet)+' feet';
                }
            }
            if (inches>0) {
                if (rounded(inches)=='1') {
                    if (return_string!='') {
                        return_string += ", "
                    }
                    return_string += rounded(inches)+' inch';
                } else {
                    var finch = fractional_inch(inches);
                    if (finch!=0) {
                        if (return_string!='') {
                            return_string += ", "
                        }
                        return_string += fractional_inch(inches)+' inches';
                    }
                }
            }
            if (return_string=='') {
                return_string = '0 inches';
            }
            return return_string;
            break;
    }
}       

function getStatusString(fringe, hemstitch, loom_waste) {
    var fringe = Number(document.getElementById('fringe').value);
    var hemstitch = Number(document.getElementById('hemstitch').value);
    var loom_waste = Number(document.getElementById('loom_waste').value);
    var status_string = "with ";
    if (fringe>0) {
        status_string += convert_and_format(fringe, document.getElementById('fringe_unit').value)+" of fringe";
    } else {
        status_string += "no fringe";
    }
    if (hemstitch>0) {
        status_string += ", "+hemstitch+" times the fabric width for hemstitching at each end";
    } else {
        status_string += ", no hemstitching";
    }
    if (loom_waste>0) {
        status_string += ", and "+convert_and_format(loom_waste, document.getElementById('loom_waste_unit').value)+" for loom waste per warp end";
    } else {
        status_string += ", and no allowance for loom waste";
    }
    return status_string;
}

function doConversion(field) {
    document.getElementById(field).value = convert(document.getElementById('_'+field).value, document.getElementById(field+'_unit').value);
}

function doInverseConversion(field) {
    document.getElementById(field).value = 1./convert(1./document.getElementById('_'+field).value, document.getElementById(field+'_unit').value);
}

function changeOutputs(field, func) {
    worked = validateNumber(document.getElementById('_'+field).value, field+'_err');
    if (worked) {
        doConversion(field);
        func();
    }
}

function changeInverseOutputs(field, func) {
    worked = validateNumber(document.getElementById('_'+field).value, field+'_err');
    if (worked) {
        doInverseConversion(field);
        if (field=='dent' && !document.getElementById('use_two_dents').checked) {
            document.getElementById('_dent_weft').value = document.getElementById('_dent').value;
            changeInverseOutputs('dent_weft', func);
        } else {
            func();
        }
    }
}

function changeStatus(func) {
    var status_string = getStatusString();
    document.getElementById('extra_info').innerHTML = status_string;
    func();
}

function changeOutputsAndStatus(field, func) {
    worked = validateNumber(document.getElementById('_'+field).value, field+'_err')
    if (worked) {
        doConversion(field);
        var status_string = getStatusString();
        document.getElementById('extra_info').innerHTML = status_string;
        func();
    }
}

function toggleDentWeft(func) {
    if (document.getElementById('use_two_dents').checked) {
        document.getElementById('dent_weft_par').style.display = 'block';
    } else {
        document.getElementById('dent_weft_par').style.display = 'none';
        changeInverseOutputs('dent', func);
    }
}

function toggleMore() {
    if (document.getElementById('more').style.display == 'none') {
        document.getElementById('more').style.display = 'block';
        document.getElementById('extras').style.display = 'none';
    } else {
        document.getElementById('extras').style.display = 'block';
        document.getElementById('more').style.display = 'none';
    }
}

function changePercentageOverrun(func) {
    document.getElementById('percentage_overrun').value = 1.+0.01*document.getElementById('_percentage_overrun').value;
    changeStatus();
}

function calculateWeft() {
    var warp_length, width, yardage, loom_waste, fringe, length, percentage_overrun, dent, dent_weft, hemstitch, yardage;
    yardage = Number(document.getElementById('yardage').value);
    loom_waste = Number(document.getElementById('loom_waste').value);
    fringe = Number(document.getElementById('fringe').value);
    length = Number(document.getElementById('length').value);
    percentage_overrun = Number(document.getElementById('percentage_overrun').value);
    dent = Number(document.getElementById('dent').value);
    dent_weft = Number(document.getElementById('dent_weft').value);
    hemstitch = Number(document.getElementById('hemstitch').value);
    warp_length_unit = document.getElementById('warp_length_unit').value;
    warp_width_unit = document.getElementById('warp_width_unit').value;
    
    warp_length = Number(loom_waste) + 2*fringe + length*percentage_overrun;
    width = yardage/(dent*warp_length + dent_weft*length*percentage_overrun+2*hemstitch);
    
    document.getElementById('output_real_length').innerHTML = convert_and_format(length, warp_length_unit);
    document.getElementById('output_warp_length').innerHTML = convert_and_format(warp_length, warp_length_unit);
    document.getElementById('output_warp_width').innerHTML = convert_and_format(width, warp_width_unit);
}

function calculateWarp() {
    var warp_length, length, loom_waste, fringe, width, percentage_overrun, dent, dent_weft, hemstitch, yardage;
    yardage = Number(document.getElementById('yardage').value);
    loom_waste = Number(document.getElementById('loom_waste').value);
    fringe = Number(document.getElementById('fringe').value);
    width = Number(document.getElementById('width').value);
    percentage_overrun = Number(document.getElementById('percentage_overrun').value);
    dent = Number(document.getElementById('dent').value);
    dent_weft = Number(document.getElementById('dent_weft').value);
    hemstitch = Number(document.getElementById('hemstitch').value);
    warp_length_unit = document.getElementById('warp_length_unit').value;
    warp_width_unit = document.getElementById('warp_width_unit').value;

    length = (yardage - width*(dent*(loom_waste + 2*fringe) + 2*hemstitch))/(width*percentage_overrun*(dent+dent_weft));
    warp_length = loom_waste + 2*fringe + length*percentage_overrun;
    
    document.getElementById('output_real_length').innerHTML = convert_and_format(length, warp_length_unit);
    document.getElementById('output_warp_length').innerHTML = convert_and_format(warp_length, warp_length_unit);
    document.getElementById('output_warp_width').innerHTML = convert_and_format(width, warp_width_unit);
        
}

function calculateYarn() {
    var warp_length, length, loom_waste, fringe, width, percentage_overrun, dent, dent_weft, hemstitch, yardage, yardage_unit;
    loom_waste = Number(document.getElementById('loom_waste').value);
    fringe = Number(document.getElementById('fringe').value);
    width = Number(document.getElementById('width').value);
    length = Number(document.getElementById('length').value);
    percentage_overrun = Number(document.getElementById('percentage_overrun').value);
    dent = Number(document.getElementById('dent').value);
    dent_weft = Number(document.getElementById('dent_weft').value);
    hemstitch = Number(document.getElementById('hemstitch').value);
    warp_length_unit = document.getElementById('warp_length_unit').value;
    warp_width_unit = document.getElementById('warp_width_unit').value;
    yardage_unit = document.getElementById('yardage_unit').value;

    yardage = length*width*percentage_overrun*(dent+dent_weft) + width*(dent*(loom_waste + 2*fringe) + 2*hemstitch);
    warp_length = loom_waste + 2*fringe + length*percentage_overrun;
    
    document.getElementById('output_yardage').innerHTML = convert_and_format(yardage, yardage_unit);
    document.getElementById('output_real_length').innerHTML = convert_and_format(length, warp_length_unit);
    document.getElementById('output_warp_length').innerHTML = convert_and_format(warp_length, warp_length_unit);
    document.getElementById('output_warp_width').innerHTML = convert_and_format(width, warp_width_unit);
        
}

function getWarpWidthsArray() {
    var warp_width_unit = document.getElementById('warp_width_unit').value;
    if (warp_width_unit=="cm") {
        widths = [10, 20, 30, 40, 50, 60, 80, 100, 150, 200];
    } else if (warp_width_unit=="m" || warp_width_unit=="yards") {
        widths = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 5];
    } else if (warp_width_unit=="inches") {
        widths = [4, 5, 6, 8, 10, 12, 15, 18, 24, 30];
    } else if (warp_width_unit=="feet" || warp_width_unit=="yards, feet, and inches") {
        widths = [0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8];
    }
    for (var i=0; i<10; i++) {
        document.getElementById('warp_widths_'+i).value = convert(widths[i], warp_width_unit);
    }
}

function printWarpWidthsArray() {
    getWarpWidthsArray();
    warp_width_unit = document.getElementById('warp_width_unit').value;
    for (var i=0; i<10; i++) {
        width = Number(document.getElementById('warp_widths_'+i).value)
        document.getElementById('output_warp_width_'+i).innerHTML = convert_and_format(width, warp_width_unit);
    }    
}
    
function calculateArea() {
    var warp_length, length, loom_waste, fringe, width, percentage_overrun, dent, dent_weft, hemstitch, yardage;
    yardage = Number(document.getElementById('yardage').value);
    loom_waste = Number(document.getElementById('loom_waste').value);
    fringe = Number(document.getElementById('fringe').value);
    percentage_overrun = Number(document.getElementById('percentage_overrun').value);
    dent = Number(document.getElementById('dent').value);
    dent_weft = Number(document.getElementById('dent_weft').value);
    hemstitch = Number(document.getElementById('hemstitch').value);
    warp_length_unit = document.getElementById('warp_length_unit').value;
    warp_width_unit = document.getElementById('warp_width_unit').value;
    for (var i=0; i<10; i++) {
        width = convert(Number(document.getElementById('warp_widths_'+i).value), warp_width_unit);
        length = (yardage - width*(dent*(loom_waste + 2*fringe) + 2*hemstitch))/(width*percentage_overrun*(dent+dent_weft))
        warp_length = loom_waste + 2*fringe + length*percentage_overrun;
        document.getElementById('output_real_length_'+i).innerHTML = convert_and_format(length, warp_length_unit);
        document.getElementById('output_warp_length_'+i).innerHTML = convert_and_format(warp_length, warp_length_unit);
    }    
}    

function blankfunc() { }

function calculateAll(func) {
    list_of_fields = ['length', 'width', 'yardage', 'loom_waste', 'fringe'];
    for (var i=0; i<list_of_fields.length; i++) {
        try {
            changeOutputs(list_of_fields[i], blankfunc);
        }
        catch(err) { }  // for fields which may not be present
    }
    list_of_fields = ['dent', 'dent_weft'];
    for (var i=0; i<list_of_fields.length; i++) {
        try {
            changeInverseOutputs(list_of_fields[i], blankfunc);
        }
        catch(err) { }  // for fields which may not be present
    }
    validateNumber(document.getElementById('hemstitch').value, 'hemstitch_err');
    validateNumber(document.getElementById('percentage_overrun').value, 'percentage_overrun_err');
    toggleDentWeft(blankfunc);
    if (func==calculateArea) {
        printWarpWidthsArray();
    }
    try {
        changeStatus(func);
    }
    catch(err) { }  // in case of previous errors
}