# weaving
Calculations for yarn lengths for different kinds of weaving.

Given the following variables:
- `length`: the desired finished length of the woven part of the fabric
- `width`: the desired finished width of the woven part of the fabric
- `d`: One plus the (fractional!) draw-in describing how much extra yarn you need because the strands will be going over and under each other (e.g. if you usually calculate 10% for draw-in, then `d=1.1=1+0.01*percentage`)
- `loom_waste`: the amount of loom waste yarn per warp end
- `fringe`: the length of the fringe at each end
- `hemstitch`: how many fabric widths to leave at each end for hemstitching (eg 4 if you leave 4 times the width)
- `dent`: the number of warp ends per unit length (typical is 8 per inch for worsted-weight yarn)
- `dent_weft`: the number of weft ends per unit length.  This is the same as dent if it's a balanced weave.

Then the total amount of yarn you need for the warp is
```
yarn_warp = dent*width*(length per warp end)
          = dent*width*(length*d+loom_waste+2*fringe)
```
and the total amount of yarn you need for the weft and hemstitching is
```
yarn_weft = dent_weft*length*(width*d)+2*hemstitch*width
```
so the total yarn is
```
yarn = width*(dent*(length*d+loom_waste+2*fringe)+dent_weft*length*d+2*hemstitch)
```
or if you'd like to be a bit more intuitive about it
```
yarn = length*width*d*(dent+dent_weft) + width*dent*(loom_waste+2*fringe) + 2*width*hemstitch
```
which is: the yarn for the main body of the fabric; the yarn for the loom waste and fringe; and the yarn for the hemstitching.

The rest of this repository is code that does this correctly.