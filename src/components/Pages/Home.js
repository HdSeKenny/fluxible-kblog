import React from 'react';
import FluxibleMixin from 'fluxible-addons-react/FluxibleMixin';
import { Link } from 'react-router';
import sweetAlert from '../../utils/sweetAlert';
import { BlogStore, UserStore } from '../../stores';
import { BlogActions } from '../../actions';
import { PinItem, ModalsFactory } from '../UI';
import { Page } from '../UI/Layout';
import { PinItemModal } from '../UserControls';

const Home = React.createClass({

  displayName: 'Home',

  contextTypes: {
    executeAction: React.PropTypes.func
  },

  mixins: [FluxibleMixin],

  statics: {
    storeListeners: [BlogStore, UserStore]
  },

  getInitialState() {
    return this.getStateFromStores();
  },

  getStateFromStores() {
    return {
      currentUser: this.getStore(UserStore).getCurrentUser(),
      kenny: this.getStore(UserStore).getKennyUser(),
      blogs: this.getStore(BlogStore).getAllBlogs(),
      welcomeText: 'What happened today, Write a blog here !',
      blogText: '',
      selectedPin: {}
    };
  },

  onChange(res) {
    const blogMessages = [
      'THUMBS_UP_BLOG_SUCCESS',
      'CANCEL_THUMBS_UP_BLOG_SUCCESS',
      'CREATE_BLOG_SUCCESS',
      'DELETE_BLOG_SUCCESS'
    ];
    if (blogMessages.includes(res.msg)) {
      sweetAlert.success(res.msg);
      this.setState({ blogs: this.getStore(BlogStore).getAllBlogs() });
    }
  },

  handleBlogText(e) {
    this.setState({ blogText: e.target.value });
  },

  handleMicroBlog() {
    const { currentUser } = this.state;
    if (currentUser) {
      const newBlog = {
        content: this.state.blogText,
        created_at: new Date(),
        type: 'microblog',
        author: currentUser._id
      };
      this.executeAction(BlogActions.AddBlog, newBlog);
    } else {
      this.checkCurrentUser();
    }
  },

  onSearchBlog(e) {
    const searchText = e.target.value.toLocaleLowerCase();
    const searchedBlogs = this.getStore(BlogStore).getSearchedBlogs(searchText);
    this.setState({ blogs: searchedBlogs });
  },

  sortByType(e) {
    const sortText = e.target.value.toLocaleLowerCase();
    const sortedBlogs = this.getStore(BlogStore).getSortedBlogs(sortText);
    this.setState({ blogs: sortedBlogs });
  },

  checkCurrentUser() {
    sweetAlert.alertWarningMessage('Login first !');
    this.setState({ blogText: '' });
  },

  onViewPinItem(id) {
    const { blogs } = this.state;
    const selectedPin = blogs.find(p => p.id_str === id);
    this.setState({ selectedPin });

    $('#pinModal').on('hidden.bs.modal', () => {
      if (this.hidePinModal) {
        this.hidePinModal();
      }
    });

    ModalsFactory.show('pinModal');
  },

  hidePinModal() {
    const homeDom = $('.home-page');
    if (homeDom && homeDom.length) {
      this.setState({ selectedPin: {} });
    }
  },

  _renderPinSection(sectionTitle, typedPins) {
    const { currentUser } = this.state;
    return (
      <section className="">
        <p className="home-tag">
          {sectionTitle} >
          <Link to="/list" className="view-all">.view more</Link>
        </p>
        <div className="pins-block">
          {typedPins.map((pin, index) => {
            const specialClass = (index + 1) % 3 === 0 ? 'mr-0' : '';
            return (
              <PinItem
                key={index}
                onSelect={(id) => this.onViewPinItem(id)}
                pin={pin}
                type={pin.type}
                currentUser={currentUser}
                specialClass={specialClass}
              />
            );
          })}
        </div>
      </section>
    );
  },

  _renderPinItems(pins) {
    const articles = pins.filter(pin => pin.type === 'article');
    const thumbedSortedArticles = articles.sort((a, b) => b.likers.length - a.likers.length);
    const moments = pins.filter(pin => pin.type === 'moment');
    const thumbedSortedMoments = moments.sort((a, b) => b.likers.length - a.likers.length);
    const dateSortedPins = pins.sort((a, b) => (new Date(b.created_at) - new Date(a.created_at)));
    return (
      <article className="classification">
        {this._renderPinSection('It\'s new', dateSortedPins)}
        {this._renderPinSection('Hot articles', thumbedSortedArticles)}
        {this._renderPinSection('Good sweets', thumbedSortedMoments)}
      </article>
    );
  },

  render() {
    const { blogs, selectedPin, currentUser } = this.state;
    return (
      <div className="home-page">
        <div className="main">
          {this._renderPinItems(blogs)}
        </div>
        <Page>
          <ModalsFactory
            modalref="pinModal"
            hidePinModal={this.hidePinModal}
            pin={selectedPin}
            currentUser={currentUser}
            ModalComponent={PinItemModal}
            showHeaderAndFooter={false}
          />
        </Page>
      </div>
    );
  }
});

export default Home;
