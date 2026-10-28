// Documento PDF de la carta. Solo usa @react-pdf/renderer, sin dependencias de Next,
// para poder renderizarlo desde el route handler y desde scripts de prueba.
import { Fragment } from "react";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Caso } from "@/lib/types";

// Nota: no poner lineHeight en el estilo de la página. En @react-pdf/renderer 4.x eso
// hace desaparecer los elementos fijos posicionados con `bottom` (el pie de página).
const styles = StyleSheet.create({
  page: { paddingTop: 56, paddingBottom: 64, paddingHorizontal: 60, fontFamily: "Times-Roman", fontSize: 11.5, color: "#15202E" },
  p: { marginBottom: 8, lineHeight: 1.3 },
  h: { fontFamily: "Times-Bold", marginTop: 6, marginBottom: 4, lineHeight: 1.3 },
  ref: { fontFamily: "Times-Bold", marginBottom: 8, lineHeight: 1.3 },
  firma: { marginTop: 4, lineHeight: 1.3 },
  header: { position: "absolute", top: 28, left: 60, right: 60, flexDirection: "row", justifyContent: "space-between", fontFamily: "Courier", fontSize: 7.5, color: "#6B82A3" },
  footer: { position: "absolute", bottom: 28, left: 60, right: 60, flexDirection: "row", justifyContent: "space-between", fontFamily: "Courier", fontSize: 7.5, color: "#6B82A3" },
});

function Bloques({ texto }: { texto: string }) {
  const parrafos = texto.split("\n\n");
  // La despedida ("Sin otro particular…") y la firma van juntas y no se parten entre páginas.
  const idxDespedida = parrafos.findIndex((p) => p.startsWith("Sin otro particular"));
  const cuerpo = idxDespedida >= 0 ? parrafos.slice(0, idxDespedida) : parrafos;
  const cierre = idxDespedida >= 0 ? parrafos.slice(idxDespedida) : [];

  const bloque = (p: string, i: number) => {
    const lineas = p.split("\n");
    const esTitulo = /^(I|II|III)\. [A-ZÁÉÍÓÚ ]+$/.test(lineas[0]);
    const esRef = lineas[0].startsWith("Ref.:");
    if (esTitulo) {
      // Título y párrafo como hermanos: minPresenceAhead evita que el título quede solo al pie de página.
      return (
        <Fragment key={i}>
          <Text style={styles.h} minPresenceAhead={60}>{lineas[0]}</Text>
          <Text style={styles.p}>{lineas.slice(1).join("\n")}</Text>
        </Fragment>
      );
    }
    return (
      <Text key={i} style={esRef ? styles.ref : styles.p}>
        {p}
      </Text>
    );
  };

  return (
    <>
      {cuerpo.map(bloque)}
      {cierre.length > 0 && (
        <View wrap={false}>
          {cierre.map((p, i) => (
            <Text key={i} style={i === 0 ? styles.p : styles.firma}>
              {p}
            </Text>
          ))}
        </View>
      )}
    </>
  );
}

export function CartaPDF({ caso }: { caso: Pick<Caso, "asunto" | "carta" | "datos"> }) {
  return (
    <Document title={caso.asunto ?? "Reclamo formal"} author={caso.datos?.nombre ?? ""} language="es-CL">
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Text>RECLAMO FORMAL · LEY 19.496</Text>
          <Text>{(caso.asunto ?? "").slice(0, 70)}</Text>
        </View>
        <Bloques texto={caso.carta ?? ""} />
        <View style={styles.footer} fixed>
          <Text>Generado con Reclamo Express · no constituye asesoría jurídica</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
