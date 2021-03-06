import React from 'react';
import PropTypes from 'prop-types';
import { List, Grid } from 'semantic-ui-react';

const renderContactItem = (item, label) =>
  item ? (
    <List>
      <List.Item>
        <List.Header className="list-header">{label}</List.Header>
        {item.address}
      </List.Item>
      <List.Item>
        <List.Header className="list-header">Домашний телефон:</List.Header>
        {item.telHome}
      </List.Item>
      <List.Item>
        <List.Header className="list-header">Мобильный телефон 1:</List.Header>
        {item.telMob1}
      </List.Item>
      <List.Item>
        <List.Header className="list-header">Мобильный телефон 2:</List.Header>
        {item.telMob2}
      </List.Item>
    </List>
  ) : (
    ''
  );

const ContactsPanelDisplay = props => {
  const { contactDetails = {} } = props;
  const { home, service, work } = contactDetails;
  const cols = Object.values(contactDetails).reduce(
    (acc, cur) => acc + ((cur && 1) || 0),
    0,
  );
  return (
    <div>
      <Grid divided="vertically">
        <Grid.Row columns={cols}>
          <Grid.Column>{renderContactItem(home, 'Адрес домашний')}</Grid.Column>
          <Grid.Column>
            {renderContactItem(service, 'Адрес для клиента')}
          </Grid.Column>
          <Grid.Column>{renderContactItem(work, 'Адрес рабочий')}</Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

ContactsPanelDisplay.propTypes = {
  contactDetails: PropTypes.object.isRequired,
};

export default ContactsPanelDisplay;
