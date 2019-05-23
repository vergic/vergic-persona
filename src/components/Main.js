import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import Button from 'react-bootstrap/Button';

const Main = ({patterns, actions, columns}) => {
	const list = patterns.map((p, i) => <div key={i}>{p.id}</div>);
	// console.log(patterns[0].mask)
	// console.log(patterns[1].mask)
	// console.log('actions', actions)
	// console.log('column', columns)
	return (
		<section className="main">
			<h1>test</h1>

			<Button variant="primary" onClick={() => actions.addPattern({data: 'kek'})}>pattern</Button>
			<Button variant="primary" onClick={() => actions.initColumns({
				nbrOfColumns: 2,
				maxHeight: 100,
				patterns: patterns
			})}>initColumns</Button>
			{list}
		</section>
	);
};

const mapStateToProps = state => ({
	nbrOfPatterns: state.pattern.length,
	patterns: state.pattern,
	columns: state.column,
});

const mapDispatchToProps = dispatch => ({
	// actions: bindActionCreators({...pattern.actions, ...column.actions}, dispatch)
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Main);

