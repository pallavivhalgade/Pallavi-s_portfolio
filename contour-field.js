// A continuous mathematical field: no particles, textures, or downloaded video.
export function contourPoint(u, seconds, layer, mode='aurora') {
  if(mode==='ocean') {
    const a=u*Math.PI*2, radius=.16+layer*.016, t=seconds*.035;
    const wave=Math.sin(a*3+t+layer*.15)*.009;
    const x=(radius+wave)*Math.cos(a),y=(radius*.56+wave)*Math.sin(a);
    const rotation=-.5+Math.sin(t*.4)*.12;
    return {x:.65+x*Math.cos(rotation)-y*Math.sin(rotation),y:.47+x*Math.sin(rotation)+y*Math.cos(rotation)};
  }
  const t=seconds*.055;
  return {x:u,y:.1+layer*.043+Math.sin(u*5+t+layer*.075)*.105+Math.cos(u*8-t*.65+layer*.14)*.045};
}
