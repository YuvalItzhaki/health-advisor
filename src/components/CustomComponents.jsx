import { XAxis as RechartsXAxis, YAxis as RechartsYAxis } from 'recharts';

function customComponents(){
    // Custom XAxis Component
    const XAxis = ({ dataKey = 'date', ...rest }) => {
        return <RechartsXAxis dataKey={dataKey} {...rest} />;
    };
  
  // Custom YAxis Component
  const YAxis = ({ ...rest }) => {
    return <RechartsYAxis {...rest} />;
  };
}


export default customComponents
