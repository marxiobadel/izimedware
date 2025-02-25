import { Link } from "react-router-dom";
import { IMAGES } from "../../constant/theme";
import parse from 'html-react-parser';

const Information = ({ doctor, coverUrl }) => {
    return (
        <div className="col-xl-12">
            <div className="card doctor-details-card">
                <div className="bg-img-bx">
                    <img src={coverUrl ?? IMAGES.Bannerbg2} alt="" className="bg-img" />
                    {doctor.skills && doctor.skills.length > 0 &&
                    <Link to={"#"} className="btn btn-primary">
                        <i className="las la-stethoscope me-3 scale5"></i>{doctor.skills[0].name}
                    </Link>}
                </div>
                <div className="card-body">
                    <div className="d-sm-flex d-block mb-3">
                        <div className="img-card mb-sm-0 mb-3">
                            <img src={doctor ? doctor.avatar_url : IMAGES.profile3png} alt={doctor.shortname} style={{ height: '294px', objectFit: 'cover' }} />
                        </div>
                        <div className="card-info d-flex align-items-start">
                            <div className="me-auto pe-3">
                                <h2 className="font-w600 mb-sm-2 mb-1 text-black">{doctor.fullname}</h2>
                                <p className="mb-sm-2 mb-1">{doctor.reference}</p>
                                <span className="date">
                                    <i className="las la-clock"></i>
                                    Rejoins le {doctor.created_at}</span>
                            </div>
                            <span className="mr-ico bg-primary">
                                {doctor.gender === 'male' ?
                                    <i className="fa-solid fa-mars"></i> :
                                    doctor.gender === 'female' ?
                                        <i className="fa-solid fa-venus"></i> :
                                        <i className="fa-solid fa-venus-mars"></i>
                                }
                            </span>
                        </div>
                    </div>
                    {doctor && doctor.biography &&
                    <>
                        <h4 className="fs-20 text-black font-w600">Biographie</h4>
                        {parse(doctor.biography)}
                    </>
                    }
                </div>
            </div>
        </div>
    );
}

export default Information;