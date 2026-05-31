import WeatherIcon from "../assets/weather-forecast.png";
import { Link } from "react-router";

interface LogoATMOSProps {
  className?: string;
}

export function LogoATMOS(props: LogoATMOSProps) {
  const { className = "" } = props;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Link to={"/"}>
        <div className="w-13 h-13">
          <img className="w-full" src={WeatherIcon} alt="ATMOS" />
        </div>
      </Link>
    </div>
  );
}
