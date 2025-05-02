import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const ActivateAccount = ({ match }) => {
    const history = useHistory();

    useEffect(() => {
        const { uidb64, token } = match.params;

        // Efectuează cererea către API pentru activarea contului
        fetch(`/api/activate/${uidb64}/${token}/`)
            .then(response => response.json())
            .then(data => {
                if (data.message === "Cont confirmat cu succes!") {
                    // Dacă activarea este cu succes, redirecționează utilizatorul
                    history.push('/intro');  // Redirecționează către pagina de introducere
                } else {
                    // Afișează un mesaj de eroare
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
