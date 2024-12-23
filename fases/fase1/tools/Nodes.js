const nodes = {
   Producciones: ['id', 'expr', 'alias'],
   Opciones: ['exprs', 'qty'],
   Union: ['exprs'],
   Expresion: ['expr', 'label', 'qty'],
   String: ['val', 'isCase', 'qty'],
   Any: ['isAny'],
   Corchetes: ['exprs', 'isCase', 'qty'],
   rango: ['start', 'end', 'isCase'],
   literalRango:['val', 'isCase'],
   idRel:['val'],
   grupo:['expr', 'qty'],
   finCadena:[]
};

export default nodes;
