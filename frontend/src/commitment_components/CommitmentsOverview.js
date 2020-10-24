import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Badge from 'react-bootstrap/Badge';
import { BasicStepNavigator } from '../commitment_components/StepNavigator';

const CommitmentsOverview = ({
  step,
  setStep,
  setUserState,
  userState,
}) => {
  const commitments = [
    {
      action: 'Call your representative',
      text:
        'National American leadership has failed to address the crisis. We must speak up and voice our views to public officials to ensure climate progress.',
      button: 'CALL',
      id: 'callRep',
    },
    {
      action: 'Talk to three people',
      text:
        'Talking to people we know is the first step toward breaking the climate silence.',
      button: 'TALK',
      id: 'talk',
    },
    {
      action: 'Join a organization',
      text:
        ' Through the hard work of organizations dedicated to climate and the environment, we can aggregate our efforts to make progress.',
      button: 'JOIN',
      id: 'participate',
    },
    {
      action: 'Encourage your employer to divest',
      text:
        'bloom psdopfasdjio asdf asdf asdf asdfasdf asdf asd ff oasid aiosioao aooas etlml asle oi',
      button: 'DIVEST',
      id: 'divestment',
    },
    {
      action: 'Call your bank',
      text:
        'All the major consumer banks in the US are deeply involved in fossil fuel financing, including since Paris. If more consumers voice their opinions, large banks will change their behavior.',
      button: 'BANK',
      id: 'callBank',
    },
  ];

  const commitClick = id => {
    console.log(`clicked ${id}`);
    console.log(userState.commitments[id]);
    setUserState({
      ...userState,
      commitments: {
        ...userState.commitments,
        [id]: !userState.commitments[id],
      },
    });
  };

  return (
    <>
      <h1 className="text-primary text-center">Actions you can take:</h1>

      <br />
      {commitments.map(commitment => (
        <Row className="mt-3" key={commitment.button}>
          <Card style={{ maxWidth: '500px', margin: 'auto' }}>
            <Card.Body>
              <Card.Title>{commitment.action} </Card.Title>{' '}
              <Card.Text
                style={{
                  fontFamily: 'proxima_nova_light',
                }}
              >
                {commitment.text}
              </Card.Text>
              <div className="text-center">
                <Button
                  className={
                    userState.commitments[commitment.id]
                      ? 'bg-success'
                      : 'bg-primary '
                  }
                  id={commitment.button}
                  onClick={e => commitClick(commitment.id)}
                  style={{
                    borderRadius: '500px',
                    height: '75px',
                    width: '75px',
                    padding: '0px',
                  }}
                >
                  {commitment.button}
                </Button>
                {/* A badge that pops up when you commit */}
                <div className="mt-3">
                  {userState.commitments[commitment.id] ? (
                    <Badge variant="light">
                      Committed <span>🎉 </span>
                    </Badge>
                  ) : null}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Row>
      ))}
      <BasicStepNavigator step={step} setStep={setStep} />
    </>
  );
};

export default CommitmentsOverview;
