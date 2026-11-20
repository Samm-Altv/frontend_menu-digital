export default function TarjetaTest({ nombre, precio }) {
  return (
    <div>
      <h2>{nombre}</h2>
      <p>${precio}</p>
    </div>
  );
}