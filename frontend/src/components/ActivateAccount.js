import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const ActivateAccount = ({ match }) => {
    const history = useHistory();

    useEffect(() => {
        const { uidb64, token } = match.params;

        // Efectuează cererea către API pentru activarea contului
        // uidb64 = User ID Base64. Este folosit pentru a transmite în siguranță identificatorul (user.pk) al unui utilizator în URL-urile de activare cont, resetare parolă etc.
        fetch(`/api/activate/${uidb64}/${token}/`)
            .then(response => response.json())
            .then(data => {
                if (data.message === "Cont confirmat cu succes!") {
                    // Dacă activarea este cu succes, redirecționează utilizatorul
                    history.push('/intro');

                } else {
                    console.log('Eroare la activarea contului:', data.error);
                }
            })
            .catch(error => console.log('Eroare API:', error));
    }, [match.params]);

    return (
        <div>
            <h2>Activarea contului...</h2>
        </div>
    );
};

export default ActivateAccount;
