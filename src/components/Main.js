import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import Button from 'react-bootstrap/Button';
import assemble from'../ducks/assemble'

const Main = ({patterns, actions, columns}) => {
	// const list = patterns.map((p, i) => <div key={i}>{p.id}</div>);
	// console.log(patterns[0].mask)
	// console.log(patterns[1].mask)
	// console.log('actions', actions)
	// console.log('column', columns)
	return (
		<section className="main">
			<h1>test</h1>

		</section>
	);
};

const mapStateToProps = state => {
	return({
		nbrOfPatterns: state.assemble.patterns.length,
		patterns: state.assemble.patterns,
		columns: state.assemble.columns,
	});
};

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(assemble.actions, dispatch)
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Main);

