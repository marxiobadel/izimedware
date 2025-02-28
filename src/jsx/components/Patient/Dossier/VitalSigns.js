import { removeStringAndSpace } from "../../../constant/theme";
import Clolesterol from "../../../pages/WidgetBasic/Clolesterol";
import GlucoseRate from "../../../pages/WidgetBasic/GlucoseRate";

const VitalSigns = ({ dossier }) => {
    return (
        <div className="row">
            <div className="col-xl-6 col-lg-6 col-xxl-6 col-md-6">
                <div className="card">
                    <div className="card-header border-0">
                        <div className="clearfix">
                            <h3 className="card-title">Pression artérielle</h3>
                            <span>{dossier ? dossier.blood_pressure_status : '---'}</span>
                        </div>
                        <div className="clearfix text-end">
                            <h3 className="text-primary mb-0">
                                {dossier && dossier.systolic_blood_pressure && dossier.diastolic_blood_pressure ?
                                    removeStringAndSpace(dossier.blood_pressure, 'mmHg') : '---'}
                            </h3>
                            <span>mmHG</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-xxl-6 col-md-6">
                <div className="card">
                    <div className="card-header border-0">
                        <div className="clearfix">
                            <h3 className="card-title">Fréquence cardiaque</h3>
                            <span className="text-danger">{dossier ? dossier.heart_rate_status : '---'}</span>
                        </div>
                        <div className="clearfix text-end">
                            <h3 className="text-danger mb-0">{dossier && dossier.heart_rate ? dossier.heart_rate : '---'}</h3>
                            <span>Par Min</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-xxl-6 col-md-6">
                <div className="card">
                    <div className="card-header border-0">
                        <div className="clearfix">
                            <h3 className="card-title">Saturation en oxygène</h3>
                            <span>{dossier ? dossier.oxygen_saturation_status : '---'}</span>
                        </div>
                        <div className="clearfix text-end">
                            <h3 className="text-primary mb-0">
                                {dossier && dossier.oxygen_saturation ? dossier.oxygen_saturation : '---'}
                            </h3>
                            <span>%</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-xxl-6 col-md-6">
                <div className="card">
                    <div className="card-header border-0">
                        <div className="clearfix">
                            <h3 className="card-title">IMC</h3>
                            <span>{dossier ? dossier.imc_status : '---'}</span>
                        </div>
                        <div className="clearfix text-end">
                            <h3 className="text-primary mb-0">
                                {dossier && dossier.imc ? dossier.imc : '---'}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-xxl-6 col-md-6">
                <div className="card">
                    <div className="card-header border-0 pb-0">
                        <div className="clearfix">
                            <h3 className="card-title">Taux de glucose</h3>
                            <span>{dossier ? dossier.blood_sugar_level_status : '---'}</span>
                        </div>
                        <div className="clearfix text-center">
                            <h3 className="text-success mb-0">{dossier && dossier.blood_sugar_level ? dossier.blood_sugar_level : '---'}</h3>
                            <span>g/dl</span>
                        </div>
                    </div>
                    <div className="card-body text-center">
                        <Clolesterol />
                    </div>
                </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-xxl-6 col-md-6">
                <div className="card">
                    <div className="card-header border-0 pb-0">
                        <div className="clearfix">
                            <h3 className="card-title">Température corporelle</h3>
                            <span>{dossier ? dossier.temperature_status : '---'}</span>
                        </div>
                        <div className="clearfix text-center">
                            <h3 className="text-info mb-0">{dossier && dossier.temperature ? dossier.temperature : '---'}</h3>
                            <span>°C</span>
                        </div>
                    </div>
                    <div className="card-body text-center">
                        <GlucoseRate />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VitalSigns;