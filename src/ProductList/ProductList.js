import React, {Component} from 'react';
import axios from 'axios';
import './ProductList.css';

class ProductList extends Component {
	state = {
		iteration: 0,
		logs: [],
		products: [],
	};

	constructor(props) {
		super(props);

		this.iteration = -1;
		this.wereLogsCleared = false;
	}

	componentDidUpdate() {
		const {logs} = this.state;

		const timeDifference = performance.now() - this.state.logs[this.iteration].startTime;
		logs[this.iteration].timeDifference = Math.ceil(timeDifference) / 1000;

		this.timer = setTimeout(() => {
			this.setState({logs});
		});

		clearTimeout(this.timer);
	}

	clearLogs() {
		this.iteration = 0;
		this.wereLogsCleared = true;

		this.setState({
			logs: [{}],
		});
	}

	async getProducts(productAmount) {
		const {logs} = this.state;

		this.wereLogsCleared ? this.wereLogsCleared = false : this.iteration++;
		logs[this.iteration] = {};
		logs[this.iteration].startTime = performance.now();
		logs[this.iteration].productAmount = productAmount;
		const response = await axios.get(`./assets/json/data-${productAmount}.json`);

		this.setState({
			logs: logs,
			products: response.data.products,
		});
	}

	render() {
		const {logs, products} = this.state;

		const productRender = products.map((product, index) => {
			return (
					<div className="product" key={index}>
						<img src={product.image}
								 className="product-image"
								 alt="product-image"/>
						<div className="product-id">
							<span className="product-title">Product ID:</span>
							<p className="product-content">{product.id}</p>
						</div>
						<div className="product-name">
							<span className="product-title">Product Name:</span>
							<p className="product-content">{product.name}</p>
						</div>
						<div className="product-description">
							<span className="product-title">Product Description</span>
							<p className="product-content">{product.description}</p>
						</div>
					</div>
			)});

		const logsRender = logs.map((log, index) => {
			if ((logs.length - index) !== 1) {
				return (
					<tr key={index}>
						<td>{index}</td>
						<td>{log.timeDifference}</td>
						<td>{log.productAmount}</td>
					</tr>
				)}

			return null;
		});

		return (
			<main>
				<section className="actions">
					<button className="btn btn-standard"
									onClick={() => this.getProducts(50)}>
						Load 50 products
					</button>
					<button className="btn btn-standard"
									onClick={() => this.getProducts(200)}>
						Load 200 products
					</button>
					<button className="btn btn-standard"
									onClick={() => this.getProducts(1000)}>
						Load 1000 products
					</button>
					<button className="btn btn-standard"
									onClick={() => this.getProducts(5000)}>
						Load 5000 products
					</button>
				</section>
				<div className="divider"></div>
				<section className="logs">
					<h2 className="title logs-title">Time Logs</h2>
					<button className="btn btn-additional"
									onClick={() => this.clearLogs()}>
						Clear Logs
					</button>
					<table className="logs-table">
						<thead>
						<tr>
							<th>№</th>
							<th>Time spent for request (in seconds)</th>
							<th>Requested quantity of products</th>
						</tr>
						</thead>
						<tbody>
						{logsRender}
						</tbody>
					</table>
				</section>
				<div className="divider"></div>
				<section className="products">
					<h2 className="title products-title">Product List</h2>
					<div className="products-container">
						{products.length ? productRender : ''}
					</div>
				</section>
			</main>
		);
	}
}

export default ProductList;
