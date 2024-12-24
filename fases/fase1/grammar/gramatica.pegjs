{{
    
    // let identificadores = []

    // import { identificadores } from '../index.js'

    import { ids, usos} from '../index.js'
    import { ErrorReglas } from './error.js';
    import { errores } from '../index.js'
}}

gramatica = _ producciones+ _ {

    let duplicados = ids.filter((item, index) => ids.indexOf(item) !== index);
    if (duplicados.length > 0) {
        errores.push(new ErrorReglas("Regla duplicada: " + duplicados[0]));
    }

    // Validar que todos los usos están en ids
    let noEncontrados = usos.filter(item => !ids.includes(item));
    if (noEncontrados.length > 0) {
        errores.push(new ErrorReglas("Regla no encontrada: " + noEncontrados[0]));
    }
}

producciones = _ id:identificador _ (literales)? _ "=" _ opciones (_";")? { ids.push(id) }

opciones = union (_ "/" _ union)*

union = expresion (_ expresion !(_ literales? _ "=") )*

expresion = ("@")? _ id:(identificador _ ":")?_ varios? _ expresiones _ ([?+*]/conteo)?

//ERRORES ENCONTRADOS: podia venir @pluck:@"expresion"  o 
/*expresion  = (etiqueta/varios)? _ expresiones _ ([?+*]/conteo)?

etiqueta = ("@")? _ id:identificador _ ":" (varios)?

 varios = ("!"/"$"/"@"/"&")*/

varios = ("!"/"&"/"$")

expresiones  =  id:identificador { usos.push(id) }
                / literales "i"?
                / "(" _ opciones _ ")"
                / corchetes "i"?
                / "."
                / "!."

// conteo = "|" parteconteo _ (_ delimitador )? _ "|"

conteo = "|" _ (numero / id:identificador) _ "|"
        / "|" _ (numero / id:identificador)? _ ".." _ (numero / id2:identificador)? _ "|"
        / "|" _ (numero / id:identificador)? _ "," _ opciones _ "|"
        / "|" _ (numero / id:identificador)? _ ".." _ (numero / id2:identificador)? _ "," _ opciones _ "|"

// parteconteo = identificador
//             / [0-9]? _ ".." _ [0-9]?
// 			/ [0-9]

// delimitador =  "," _ expresion

// Regla principal que analiza corchetes con contenido
corchetes
    = "[" contenido:(rango / texto)+ "]" {
        return `Entrada válida: [${input}]`;
    }

// Regla para validar un rango como [A-Z]
rango
    = inicio:caracter "-" fin:caracter {
        if (inicio.charCodeAt(0) > fin.charCodeAt(0)) {
            throw new Error(`Rango inválido: [${inicio}-${fin}]`);

        }
        return `${inicio}-${fin}`;//se debe crear la lista
    }

// Regla para caracteres individuales
caracter
    = [a-zA-Z0-9_ ] { return text()}



/* GRAMATICAS ANTERIORES, DAN ERROR AL TRATAR DE RECONOCER EJ: [abc0-3], reconocimiento esperado: [a,b,c,1,2,3]
                                                                  Salida que se obtiene: [a,b,c,1,-,3]

 contenido
   = elementos:(corchete / texto)+ {
      return new n.Contenido(elementos);
  }

 corchete
    = "[" contenido "]" 
*/

// Coincide con cualquier contenido que no incluya "]"

texto
    = [^\[\]]

literales = '"' stringDobleComilla* '"'
            / "'" stringSimpleComilla* "'"

stringDobleComilla = !('"' / "\\" / finLinea) .
                    / "\\" escape
                    //(se quitaron porque peggyjs no acepta cadenas con multilinea) igual no funcionaba xd
                    // / continuacionLinea

stringSimpleComilla = !("'" / "\\" / finLinea) .
                    / "\\" escape
                    //(se quitaron porque peggyjs no acepta cadenas con multilinea) igual no funcionaba xd
                    // / continuacionLinea

//(se quitaron porque peggyjs no acepta cadenas con multilinea) igual no funcionaba xd
// continuacionLinea = "\\" secuenciaFinLinea

continuacionLinea = "\\" secuenciaFinLinea

finLinea = [\n\r\u2028\u2029]

escape = "'"
        / '"'
        / "\\"
        / "b"
        / "f"
        / "n"
        / "r"
        / "t"
        / "v"
        / "u"

secuenciaFinLinea = "\r\n" / "\n" / "\r" / "\u2028" / "\u2029"

// literales = 
//     "\"" [^"]* "\""
//     / "'" [^']* "'"
    

numero = [0-9]+

identificador = [_a-z]i[_a-z0-9]i* { return text() }


_ = (Comentarios /[ \t\n\r])*


Comentarios = 
    "//" [^\n]* 
    / "/*" (!"*/" .)* "*/"
