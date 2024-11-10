export function SelectMeasure({...rest}) {
  return   <select className="bg-gray300 text-white outline-none rounded-r-md" {...rest}>
  <option>Ml</option>    
  <option>Litro</option>
</select>;
}